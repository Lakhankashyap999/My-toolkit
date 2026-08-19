// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images = formData.getAll("images") as File[];

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required." },
        { status: 400 }
      );
    }

    const pdfDoc = await PDFDocument.create();

    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer();
      const mimeType = image.type;
      let embeddedImage;

      if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
        embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
      } else if (mimeType === "image/png") {
        embeddedImage = await pdfDoc.embedPng(arrayBuffer);
      } else {
        continue;
      }

      const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error("Image to PDF error:", error);
    return NextResponse.json(
      { error: "Failed to convert images to PDF. Please try again." },
      { status: 500 }
    );
  }
}