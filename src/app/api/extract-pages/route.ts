// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pagesInput = formData.get("pages") as string;

    if (!file || !pagesInput) {
      return NextResponse.json({ error: "PDF file and pages are required." }, { status: 400 });
    }

    // Parse page numbers (e.g., "1,3-5")
    const pageNumbers: number[] = [];
    const parts = pagesInput.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (isNaN(start) || isNaN(end)) return NextResponse.json({ error: "Invalid page range." }, { status: 400 });
        for (let i = start; i <= end; i++) pageNumbers.push(i);
      } else {
        const page = parseInt(trimmed);
        if (!isNaN(page)) pageNumbers.push(page);
      }
    }

    const uniquePages = [...new Set(pageNumbers)].sort((a, b) => a - b);

    const srcArrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(srcArrayBuffer, { ignoreEncryption: true });
    const totalPages = srcPdf.getPageCount();

    if (uniquePages.some((p) => p < 1 || p > totalPages)) {
      return NextResponse.json({ error: `Page numbers must be between 1 and ${totalPages}.` }, { status: 400 });
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcPdf, uniquePages.map((p) => p - 1));
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="extracted.pdf"',
      },
    });
  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json({ error: "Failed to extract pages. Please try again." }, { status: 500 });
  }
}