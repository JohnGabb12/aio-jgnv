import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

export const runtime = "nodejs";

/*

# Worker route for image conversion

- This route handles POST requests from the image conversion queue.
- It processes the payload containing jobId, targetFormat, and source files.
- Validates the payload and each source file (size and format).
- Downloads each source file, converts it to the target format using Sharp, and uploads the converted file to Vercel Blob Storage.
- Updates the job status via a callback URL after processing each file and when the entire job is done.

## Tech Stacks
- Sharp               : for image processing
- Vercel Blob Storage : for file handling
- Next.js API Routes  : for handling HTTP requests

*/

const MB = 1024 * 1024;
const MAX_SIZE_BYTES = 2 * MB;

/*

Refer to image-converter/route.ts for the explanation of the following types and functions:
- AllowedFormat

*/
const allowedFormats = ["png", "jpeg", "webp", "avif"] as const;
type AllowedFormat = (typeof allowedFormats)[number];

const MIME_BY_FORMAT: Record<AllowedFormat, string> = { // Mapping of allowed formats to their corresponding MIME types
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
};

/*

## Types

SourceFile
- Represents a source file to be converted, containing its name, URL, content type, and size.

WorkerPayload
- Represents the payload sent to the worker, containing the job ID, target format, and an array of source files.

ConvertedFile
- Represents a converted file, containing the original name, converted name, and URL of the converted file.

*/
type SourceFile = {
    name: string;
    url: string;
    contentType: string;
    size: number;
};

type WorkerPayload = {
    jobId: string;
    targetFormat: AllowedFormat;
    files: SourceFile[];
};

type ConvertedFile = {
    originalName: string;
    convertedName: string;
    url: string;
};

/*

## Helpers
- isAllowedFormat(value: unknown): value is AllowedFormat
- safeFileName(name: string): string
- getBaseName(fileName: string): string
- convertImage(buffer: Buffer, targetFormat: AllowedFormat): Promise<Buffer>
- updateJobStatus(jobId: string, payload: Record<string, unknown>): Promise<void>
- downloadSourceFile(sourceFile: SourceFile): Promise<Buffer>
- processWorkerPayload(payload: WorkerPayload): Promise<ConvertedFile[]>

*/
function isAllowedFormat(value: unknown): value is AllowedFormat {
    return typeof value === "string" && allowedFormats.includes(value as AllowedFormat);
}

function safeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function getBaseName(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, "");
}

/*

convertImage(buffer: Buffer, targetFormat: AllowedFormat): Promise<Buffer>
- Converts the input image buffer to the specified target format using Sharp.
- Applies appropriate quality settings based on the target format to balance file size and visual quality.

*/
async function convertImage(buffer: Buffer, targetFormat: AllowedFormat) {
    const image = sharp(buffer); // Initialize Sharp with the input buffer

    switch (targetFormat) {
        case "png":
            return image
                .png()
                .toBuffer(); // PNG is lossless, so no quality setting is needed
        case "jpeg":
            return image
                .jpeg({ quality: 82 })
                .toBuffer(); // Quality 82 is a good balance between file size and visual quality for JPEG
        case "webp":
            return image
                .webp({ quality: 82 })
                .toBuffer(); // Quality 82 is a good balance for WebP as well
        case "avif":
            return image
                .avif({ quality: 50 })
                .toBuffer(); // AVIF can achieve good compression at lower quality settings, so 50 is often sufficient
        default:
            throw new Error(`Unsupported target format: ${targetFormat}`);
    }
}

/*

updateJobStatus(jobId: string, payload: Record<string, unknown>): Promise<void>
- Sends a POST request to the configured status URL to update the job status.
- The payload can include the current status of the job, total files, and an array of converted files when the job is done.
- If no status URL is configured, it logs a message and skips the update.

*/
async function updateJobStatus(
    jobId: string,
    payload: Record<string, unknown>,
) {
    const statusUrl = process.env.IMAGE_CONVERTER_STATUS_URL; // URL to send job status updates to (configured in environment variables)
    if (!statusUrl) {
        console.log("No status URL configured, skipping job status update");
        return;
    }

    /*
    
    The response structure:
    {
        ok: boolean; // Indicates if the update was successful
        jobId: string; // The ID of the job being updated
        status: string; // The current status of the job (e.g., "processing", "done", "error")
        files?: ConvertedFile[]; // Optional array of converted files (included when status is "done")
    }

    */
    const response = await fetch(statusUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId, ...payload }), // ...payload unpacks the payload object to include its properties in the request body
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Status update failed (${response.status}): ${message}`);
    }
}

/*

downloadSourceFile(sourceFile: SourceFile): Promise<Buffer>
- Downloads the source file from its URL and returns it as a Buffer for processing with Sharp.
- If the download fails, it throws an error with a message indicating which file failed to download.

*/
async function downloadSourceFile(sourceFile: SourceFile) {
    const response = await fetch(sourceFile.url); // Download the source file from its URL

    if (!response.ok) { throw new Error(`Failed to fetch source file: ${sourceFile.name}`); }
    return Buffer.from(await response.arrayBuffer()); // Convert the response to a Buffer for processing with Sharp
}

/*

processWorkerPayload(payload: WorkerPayload): Promise<ConvertedFile[]>
- Validates the worker payload and processes each source file sequentially.
- For each file, it downloads the source file, converts it to the target format, and uploads the converted file to Vercel Blob Storage.
- Updates the job status after processing each file and when the entire job is done.
- Returns an array of converted files with their original names, converted names, and URLs.

*/
async function processWorkerPayload(payload: WorkerPayload) {
    if (!payload.jobId) { throw new Error("Missing jobId"); }
    if (!isAllowedFormat(payload.targetFormat)) { throw new Error("Invalid target format"); }
    if (!Array.isArray(payload.files) || payload.files.length === 0) { throw new Error("No files provided"); }

    const results: ConvertedFile[] = [];

    await updateJobStatus(payload.jobId, {
        status: "processing",
        totalFiles: payload.files.length,
    }); // Update job status to "processing" with total files count

    for (const [index, sourceFile] of payload.files.entries()) {
        if (!sourceFile?.url || !sourceFile?.name) { throw new Error(`Invalid file payload at index ${index}`); } // Validate file payload structure
        if (sourceFile.size > MAX_SIZE_BYTES) { throw new Error(`Source file too large: ${sourceFile.name}`); }

        const inputBuffer = await downloadSourceFile(sourceFile); // Download the source file as a Buffer
        const convertedBuffer = await convertImage(inputBuffer, payload.targetFormat); // Convert the image to the target format

        const baseName = getBaseName(sourceFile.name); // Get the base name of the file (without extension) to construct the converted file name
        const convertedName = `${baseName}.${payload.targetFormat}`; // Construct the converted file name by appending the target format extension to the base name
        const blobPath = `image-converter/${payload.jobId}/converted/${String(index).padStart(2, "0")}-${safeFileName(convertedName)}`; // Construct the blob path for uploading the converted file, including the job ID and a zero-padded index for ordering

        const blob = await put(blobPath, convertedBuffer, {
            access: "public",
            contentType: MIME_BY_FORMAT[payload.targetFormat],
        }); // Upload the converted file to Vercel Blob Storage with public access and the appropriate content type

        results.push({
            originalName: sourceFile.name,
            convertedName,
            url: blob.url,
        }); // Add the converted file information to the results array
    }

    await updateJobStatus(payload.jobId, {
        status: "done",
        files: results,
    }); // Update job status to "done" with the list of converted files

    return results;
}

/*

## POST Handler
- Handles POST requests to the worker route.
- Parses the incoming request body as JSON and validates it against the WorkerPayload type.
- Calls processWorkerPayload to handle the image conversion and returns a JSON response with the job ID, status, and converted files if successful.
- If any error occurs during processing, it catches the error and returns a JSON response with an error message and a 500 status code.

*/

export async function POST(request: Request) {
    try {
        const payload = (await request.json()) as WorkerPayload; // Parse the incoming request body as JSON and cast it to the WorkerPayload type for type safety

        const files = await processWorkerPayload(payload); // Process the worker payload to handle the image conversion and get the list of converted files

        return NextResponse.json({
            ok: true,
            jobId: payload.jobId,
            status: "done",
            files,
        });
    } catch (error) {
        console.error("Error in POST /api/v1/image-converter/worker:", error);

        const message = error instanceof Error ? error.message : "Worker failed";

        return NextResponse.json({
            error: message,
        }, { status: 500 });
    }
}