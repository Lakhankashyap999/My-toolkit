import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToolBox — All Your Daily Tools in One Place",
  description:
    "Edit PDFs, create resumes, compress images, CA Tax Suite, Legal Tools, CNC Diagnostics, DeutschReady German Learning — free, fast, 100% in-browser.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}