import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

/*

# Form endpoint
- POST /api/v1/image-converter
- This endpoint handles the image conversion process.
- It accepts multipart/form-data with image files uploaded by the user.

## Pages involved
- /converter : This page contains the file upload form that submits to this endpoint.

## Tech Stacks
- React Hooks         : for state management and callbacks
- Vercel Blob Storage : for file handling
- QStash              : for queueing conversion tasks
- Sharp               : for image processing

*/

const MB = 1024 * 1024; // 1MB in bytes
const MAX_SIZE = 2 * MB;
const MAX_FILES = 2;

/*

## Types

EnqueuedFile
- Represents a file that has been validated and is ready to be enqueued for conversion.
- Contains the file name, URL (after being uploaded to blob storage), content type, and size.

QueuePayload
- Represents the payload that will be sent to the queueing system (QStash) for processing the conversion job.
- Contains a unique job ID, the target format for conversion, and an array of EnqueuedFile objects representing the files to be converted.

*/
type EnqueuedFile = {
    name: string;
    url: string;
    contentType: string;
    size: number;
}

type QueuePayload = {
    jobId: string;
    targetFormat: AllowedFormat;
    files: EnqueuedFile[];
}

/*

## Notes

`as const` Const Assertion makes the type name a literal type instead of a general string array.

typeof array[number] makes it so that the type is a union of the array's element types instead of the array type itself.

Example:
const arr = ["a", "b", "c"] as const; // Type is readonly ["a", "b", "c"]
type ElementType = typeof arr[number]; // Type is "a" | "b" | "c"

*/
const ALLOWED_FORMATS = ["png", "jpeg", "webp", "avif"] as const;    // Allowed target formats for conversion
type AllowedFormat = typeof ALLOWED_FORMATS[number];                 // Type for allowed formats (union of string literals)

/*

## Helpers 

- isAllowedFormat(text: unknown): text is AllowedFormat
- safeFileName(fileName: string): string
- publishToQstash(payload: QueuePayload): Promise<void>

*/

/*

isAllowedFormat(text: unknown): text is AllowedFormat
- Type guard function to check if a given text is one of the allowed formats.
- Returns true if the text is a string and is included in the ALLOWED_FORMATS array, otherwise returns false.

@param text - The input to check if it's an allowed format.
@returns boolean indicating whether the input is an allowed format or not.

*/
function isAllowedFormat(text: unknown): text is AllowedFormat {
    return typeof text === "string" && ALLOWED_FORMATS.includes(text as AllowedFormat);
}

/*

safeFileName(fileName: string): string
- Utility function to sanitize file names by replacing any characters that are not alphanumeric, dot, hyphen, or underscore with an underscore.
- This is important to ensure that file names are safe for use in URLs and file systems.

@param fileName - The original file name to be sanitized.
@returns A sanitized version of the file name that is safe for use in URLs and file systems.

*/
function safeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

/*

publishToQstash(payload: QueuePayload): Promise<void>
- Asynchronously publishes a conversion job payload to QStash for processing.
- It sends a POST request to the QStash publish endpoint with the job details, including the target format and file information.
- The function handles errors by logging them and throwing an exception if the request fails.

@param payload - The QueuePayload object containing the job ID, target format, and files to be converted.
@returns A promise that resolves when the payload is successfully published to QStash, or rejects with an error if the request fails.

*/
async function publishToQstash(payload: QueuePayload): Promise<void> {
    const workerUrl = process.env.QSTASH_WORKER_URL;    // env.local (vercel)
    const qstashToken = process.env.QSTASH_TOKEN;       // env.local (vercel)

    if (!workerUrl || !qstashToken) {
        console.error("QStash configuration is missing");
        throw new Error("QStash configuration is missing");
    }

    /*
    
    The payload structure sent to QStash will look like this:
    {
        jobId: "unique-job-id",
        targetFormat: "png",
        files: [
            {
                name: "example.png",
                url: "https://vercel.com/blob/...",
                contentType: "image/png",
                size: 123456
            },
            // ... more files if uploaded
        ]
    }

    */
    const response = await fetch(
        `https://qstash.upstash.io/v2/publish/${encodeURIComponent(workerUrl)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${qstashToken}`,
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to publish to QStash:", errorText);
        throw new Error(`Failed to publish to QStash: ${errorText}`);
    }
}

/*

request.formData() contains:
- files: FileList (the uploaded files)
- targetFormat: string (the desired output format, e.g. "png", "jpeg", etc.)

*/

export async function POST(request: Request) {
    try {
        const formData = await request.formData();                  // get form data from request
        if (!formData.has("files")) { return NextResponse.json({ error: "No files uploaded" }, { status: 400 }); }

        /*
        
        Target format | From <select name="targetFormat"> => string
        
        Helpers:
        - isAllowedFormat(text: unknown): text is AllowedFormat

        */
        const targetFormat = formData.get("targetFormat");          // get target format from form data
        if (!isAllowedFormat(targetFormat)) { return NextResponse.json({ error: "Invalid target format" }, { status: 400 }); }

        /*

        targetFormatTyped: AllowedFormat (type assertion to ensure it's one of the allowed formats)
        results: Array<{ fileName: string; url: string }> (array to hold conversion results, each with file name and URL)
        
        */
        const targetFormatTyped = targetFormat as AllowedFormat;    // Type assertion to ensure targetFormat is of type AllowedFormat
        const results: Array<{ fileName: string; url: string }> = []; // Array to hold conversion results (file name and URL)
        /*
        
        Files | From <input type="file" name="files" multiple> => File[]

        Validation:
        - files.length > 0
        - files.length <= 2

        Validation for each file:
        - file instanceof File
        - file.type.startsWith("image/")
        - file.size <= 2 * MB
        
        */
        const files = formData.getAll("files").filter((file): file is File => file instanceof File) as File[]; // get files and filter to ensure they are of type File
        if (files.length === 0) { return NextResponse.json({ error: "No valid files uploaded" }, { status: 400 }); }
        if (files.length > MAX_FILES) { return NextResponse.json({ error: `You can only upload up to ${MAX_FILES} files` }, { status: 400 }); }

        const jobId = crypto.randomUUID();          // Generate a unique job ID for this conversion task
        const enqueuedFiles: EnqueuedFile[] = [];   // Array to hold files that have been validated and uploaded to blob storage

        /*
        
        For each file:
        - Validate file type and size
        - Sanitize file name using safeFileName()
        - Upload file to Vercel Blob Storage using put() and get the blob URL
        - Add the file details (name, URL, content type, size) to the enqueuedFiles array for later processing

        Helpers:
        - safeFileName(fileName: string): string
        
        */
        for (const [index, file] of files.entries()) { // Loop through each uploaded file for validation and processing. Each loop runs sequentially due to 'await' on 'put()'
            if (!file.type.startsWith("image/")) { return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 }); }
            if (file.size > MAX_SIZE) { return NextResponse.json({ error: `File size must be less than ${MAX_SIZE / MB}MB` }, { status: 400 }); }

            const safeName = `${String(index).padStart(2, "0")}-${safeFileName(file.name)}`;    // Sanitize the file name to ensure it's safe for URLs and file systems
            const blobPath = `image-converter/${jobId}/source/${safeName}`;                     // Construct the blob path for storing the file in Vercel Blob Storage

            const blob = await put(blobPath, file, {
                access: "public",
                contentType: file.type || "application/octet-stream"
            }); // Upload the file to Vercel Blob Storage and waits for the blob URL

            // Add file to enqueuedFiles array with its name, URL, content type, and size for later processing
            enqueuedFiles.push({
                name: file.name,
                url: blob.url,
                contentType: file.type || "application/octet-stream",
                size: file.size
            });
        }

        /*
        
        Qstash publishing:
        - After all files have been validated and uploaded to blob storage, we publish a job to QStash with the job ID, target format, and the array of enqueued files.
        - This allows the conversion task to be processed asynchronously by a worker that listens to the QStash queue.

        Helpers:
        - publishToQstash(payload: QueuePayload): Promise<void>

        */
        await publishToQstash({
            jobId,
            targetFormat: targetFormatTyped,
            files: enqueuedFiles
        } as QueuePayload);

        return NextResponse.json(
            {
                ok: true,
                jobId,
                message: "Files uploaded and conversion job enqueued successfully",
                status: "queue",
                statusUrl: `/api/v1/image-converter/status?jobId=${jobId}` // This is the URL where the client can check the status of their conversion job
            },
            { status: 202 }
        );
    } catch (error) {
        console.error("Error in POST /api/v1/image-converter:", error);
        return NextResponse.json({ error: "Failed to enqueue conversion job" }, { status: 500 });
    }
}