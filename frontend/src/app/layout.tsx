import type { Metadata } from "next";
import { DM_Sans, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});
const manrope = Manrope({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      className={cn("h-full", "antialiased", dmSans.variable, inter.variable, "font-sans", manrope.variable, interHeading.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}