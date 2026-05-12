"use client";

import { Metadata } from "next";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Layout } from "@/components/layout/default-layout";

/*

# Converter Page

- This page allows users to upload image files for conversion.
- Users can upload up to 2 image files, each must be less than 2MB in size.
- The page uses the FileUpload component from DiceUI (shadcn/ui) for file handling.
- Validation is performed on file type and size, with error messages shown via toast notifications.

## Tech Stacks
- React Hooks         : for state management and callbacks
- Vercel Blob Storage : for file handling
- QStash              : for queueing conversion tasks
- Sharp               : for image processing
- Sonner              : for toast notifications

*/

export default function Converter() {
    const [files, setFiles] = React.useState<File[]>([]);

    /*
    
    File Validation || React.useCallback(file: File) => string | null
    - 1024 * 1024 == 1MB
    - file.type => "image/png", "image/jpeg", etc. (starts with "image/")
    - files.length => number of files
    - Return error message string if validation fails, otherwise return null

    */

    const onFileValidate = React.useCallback(
        (file: File): string | null => {
            const MB = 1024 * 1024;
            const MAX_SIZE = 2 * MB; // 2MB

            if (files.length >= 2) { return "You can only upload up to 2 files"; }              // Validate max files
            if (!file.type.startsWith("image/")) { return "Only image files are allowed"; }                   // Validate file type (only images)
            if (file.size > MAX_SIZE) { return `File size must be less than ${MAX_SIZE / MB}MB`; } // Validate file size

            return null; // Validation passed
        },
        [files],
    );

    /*
    
    File Rejection || React.useCallback(file: File, message: string) => void
    - toast(message, { description: string }) => void
    - file: the file that was rejected
    - message: the error message from validation
    - Use toast to show the error message, including the file name (truncate if too long)
    - toast uses sonner library from shadcn/ui (https://ui.shadcn.com/docs/components/radix/sonner)

    */

    const onFileReject = React.useCallback((file: File, message: string) => {
        const truncatedName = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name; // Truncate if file name is too long

        toast(message, { description: `"${truncatedName}" has been rejected` }); // Initiate toast message
    }, []);

    return (
        <Layout>
            <form action="" method="post">
                {/*
                ## File Upload Component
                
                FileUpload
                - value: files (state : File[])
                - onValueChange: setFiles (state updater)
                - onFileValidate: onFileValidate (validation callback : Readt.useCallback(file: File) => string | null)
                - onFileReject: onFileReject (rejection callback : React.useCallback(file: File, message: string) => void)
                - accept: "image/*" (accept only image files)
                - maxFiles: 2 (limit to 2 files)
                - multiple: true (allow multiple file selection)
                
                */}

                <FileUpload
                    value={files}
                    onValueChange={setFiles}
                    onFileValidate={onFileValidate}
                    onFileReject={onFileReject}
                    accept="image/*"
                    maxFiles={2}
                    className="w-full max-w-md pt-50 mx-auto"
                    multiple
                >
                    <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center justify-center rounded-full border p-2.5">
                                <Upload className="size-6 text-muted-foreground" />
                            </div>
                            <p className="font-medium text-sm">Drag & drop images here</p>
                            <p className="text-muted-foreground text-xs">
                                Or click to browse (max 2 files)
                            </p>
                        </div>

                        {/* asChild is used to wrap the child element in a button */}
                        <FileUploadTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-2 w-fit">
                                Browse files
                            </Button>
                        </FileUploadTrigger>
                    </FileUploadDropzone>

                    <FileUploadList>
                        {files.map((file) => (
                            <FileUploadItem key={file.name} value={file}>
                                <FileUploadItemPreview />
                                <FileUploadItemMetadata />
                                <FileUploadItemDelete asChild>
                                    <Button variant="ghost" size="icon" className="size-7">
                                        <X />
                                    </Button>
                                </FileUploadItemDelete>
                            </FileUploadItem>
                        ))}
                    </FileUploadList>
                </FileUpload>
            </form>
        </Layout>
    );
}