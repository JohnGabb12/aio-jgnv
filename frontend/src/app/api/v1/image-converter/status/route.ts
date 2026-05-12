import { NextResponse } from "next/server";
import { get, put } from "@vercel/blob";

export const runtime = "nodejs";

/*

Status Route for Image Converter API

This route handles the status updates and retrieval for image conversion jobs. It uses Vercel Blob Storage to store and retrieve job status records as JSON files.

Key Features:
- POST /api/v1/image-converter/status: Updates the status of a conversion job. Expects a JSON payload with jobId, status, and optional fields like totalFiles, files, and error message.
- GET /api/v1/image-converter/status?jobId=xxx: Retrieves the current status of a conversion job by its jobId.

Data Model:
- JobStatusRecord: Represents the structure of a job status record stored in blob storage, including jobId, status, totalFiles, files, error message, and updatedAt timestamp.

Validation:
- The POST handler validates the presence of jobId and ensures that the status is one of the allowed values ("queued", "processing", "done", "failed").

Error Handling:
- Both handlers return appropriate HTTP status codes and error messages for missing parameters,

*/

const STATUS_PREFIX = "image-converter/jobs";
const STATUS_ACCESS = "public" as const;

const allowedStatuses = ["queued", "processing", "done", "failed"] as const;
type JobStatus = (typeof allowedStatuses)[number];

/*

## Types

JobFile: Represents an individual file associated with a conversion job, including the original file name, the converted file name, and the URL to access the converted file.
JobStatusRecord: Represents the status record for a conversion job, including the job ID, current status, total number of files, an array of JobFile objects, an optional error message, and the timestamp of the last update.
StatusPayload: Represents the payload expected in the POST request to update a job status, which includes the job ID, new status, and optional fields for total files, files, and error message.

*/
type JobFile = {
	originalName: string;
	convertedName: string;
	url: string;
};

type JobStatusRecord = {
	jobId: string;
	status: JobStatus;
	totalFiles?: number;
	files?: JobFile[];
	error?: string;
	updatedAt: string;
};

type StatusPayload = Partial<Omit<JobStatusRecord, "jobId" | "updatedAt">> & {
	jobId: string;
	status: JobStatus;
};

/*

## Helpers

isJobStatus: Type guard function to validate if a given value is a valid JobStatus.
getStatusPath: Helper function to construct the blob storage path for a given job ID.
streamToText: Helper function to convert a ReadableStream of Uint8Array into a text string.
readJobStatus: Helper function to read a job status record from blob storage based on the job ID. Returns the JobStatusRecord or null if not found.
writeJobStatus: Helper function to write a JobStatusRecord to blob storage.

*/
function isJobStatus(value: unknown): value is JobStatus {
	return typeof value === "string" && allowedStatuses.includes(value as JobStatus);
}

function getStatusPath(jobId: string) {
	return `${STATUS_PREFIX}/${jobId}.json`;
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
	return new Response(stream).text();
}

async function readJobStatus(jobId: string): Promise<JobStatusRecord | null> {
	const blob = await get(getStatusPath(jobId), { access: STATUS_ACCESS });

	if (!blob || blob.statusCode !== 200) {
		return null;
	}

	const raw = await streamToText(blob.stream);
	return JSON.parse(raw) as JobStatusRecord;
}

async function writeJobStatus(record: JobStatusRecord) {
	await put(getStatusPath(record.jobId), JSON.stringify(record), {
		access: STATUS_ACCESS,
		contentType: "application/json",
	});
}

export async function POST(request: Request) {
	try {
		const payload = (await request.json()) as StatusPayload;

		if (!payload?.jobId || typeof payload.jobId !== "string") {
			return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
		}

		if (!isJobStatus(payload.status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}

		const previous = await readJobStatus(payload.jobId);
		const record: JobStatusRecord = {
			jobId: payload.jobId,
			status: payload.status,
			totalFiles: payload.totalFiles ?? previous?.totalFiles,
			files: payload.files ?? previous?.files,
			error: payload.error ?? previous?.error,
			updatedAt: new Date().toISOString(),
		};

		await writeJobStatus(record);

		return NextResponse.json({ ok: true, status: record.status, jobId: record.jobId });
	} catch (error) {
		console.error("Error in POST /api/v1/image-converter/status:", error);
		return NextResponse.json(
			{ error: "Failed to update job status" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const jobId = searchParams.get("jobId");

		if (!jobId) {
			return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
		}

		const record = await readJobStatus(jobId);

		if (!record) {
			return NextResponse.json({ error: "Job not found" }, { status: 404 });
		}

		return NextResponse.json({ ok: true, job: record });
	} catch (error) {
		console.error("Error in GET /api/v1/image-converter/status:", error);
		return NextResponse.json(
			{ error: "Failed to load job status" },
			{ status: 500 },
		);
	}
}