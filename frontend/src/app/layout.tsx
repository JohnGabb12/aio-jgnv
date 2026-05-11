import type { Metadata } from "next";
import { DM_Sans, Inter, Manrope, Archivo_Black } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const interHeading = Archivo_Black({subsets:['latin'],variable:'--font-heading', weight: "400"});
const manrope = Archivo_Black({subsets:['latin'],variable:'--font-sans', weight: "400"});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
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
      className={cn("h-full", "antialiased", archivoBlack.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}