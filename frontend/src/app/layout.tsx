import type { Metadata } from "next";
import { Lexend, Archivo_Black } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  adjustFontFallback: false,
  weight: ["400", "500", "600", "700"],
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
      className={cn("h-full", "antialiased", lexend.variable, archivoBlack.variable)}
    >
      <body className={cn("min-h-full flex flex-col", lexend.className)}>{children}</body>
    </html>
  );
}