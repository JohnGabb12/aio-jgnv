import type { Metadata } from "next";
import { Elms_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const elmsSans = Elms_Sans({
  variable: "--font-elms-sans",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black-next",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AIO JGNV", // Page title
    description: "All in one JGNV dashboard and tools", // Page description
    applicationName: "AIO JGNV",
    authors: [{ name: "JGNV", url: "https://jgnv.dev" }],
    generator: "Next.js",
    keywords: ["Next.js", "Vercel", "React", "TypeScript"],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", elmsSans.variable, archivoBlack.variable)}
    >
      <body className={cn("min-h-full flex flex-col", elmsSans.className)}>{children}</body>
    </html>
  );
}