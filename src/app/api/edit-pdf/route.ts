// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const addText = (formData.get("addText") as string) || "";
    const addTextX = parseFloat((formData.get("addTextX") as string) || "100");
    const addTextY = parseFloat((formData.get("addTextY") as string) || "100");
    const textSize = parseFloat((formData.get("textSize") as string) || "16");
    const textColor = (formData.get("textColor") as string) || "#000000";
    const watermark = (formData.get("watermark") as string) || "";
    const watermarkOpacity = parseFloat((formData.get("watermarkOpacity") as string) || "0.3");
    const watermarkSize = parseFloat((formData.get("watermarkSize") as string) || "40");
    const deletePagesInput = (formData.get("deletePages") as string) || "";
    const rotateAngle = parseFloat((formData.get("rotateAngle") as string) || "0");

    if (!file) {
      return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    // Helper: hex to rgb
    const hexToRgb = (hex: string) => {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.substring(0, 2), 16) / 255;
      const g = parseInt(clean.substring(2, 4), 16) / 255;
      const b = parseInt(clean.substring(4, 6), 16) / 255;
      return { r, g, b };
    };

    // 1. Add Text
    if (addText.trim()) {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const { r, g, b } = hexToRgb(textColor);
      const color = rgb(r, g, b);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const xPos = addTextX || width / 2 - (addText.length * textSize) / 4;
        const yPos = addTextY || height / 2;
        page.drawText(addText, { x: xPos, y: yPos, size: textSize, font, color });
      }
    }

    // 2. Add Watermark
    if (watermark.trim()) {
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const { r, g, b } = hexToRgb("#888888");
      const color = rgb(r, g, b);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = watermark.length * watermarkSize * 0.6;
        const x = (width - textWidth) / 2;
        const y = (height - watermarkSize) / 2;
        page.drawText(watermark, {
          x,
          y,
          size: watermarkSize,
          font,
          color,
          opacity: watermarkOpacity,
          rotate: degreesToRadians(45),
        });
      }
    }

    // 3. Delete Pages
    if (deletePagesInput.trim()) {
      const pagesToDelete: number[] = [];
      const parts = deletePagesInput.split(",");
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [startStr, endStr] = trimmed.split("-");
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) pagesToDelete.push(i);
          }
        } else {
          const page = parseInt(trimmed);
          if (!isNaN(page)) pagesToDelete.push(page);
        }
      }

      const uniquePages = [...new Set(pagesToDelete)].sort((a, b) => b - a);
      for (const pageNum of uniquePages) {
        const index = pageNum - 1;
        if (index >= 0 && index < pdfDoc.getPageCount()) {
          pdfDoc.removePage(index);
        }
      }
    }

    // 4. Rotate Pages
    if (rotateAngle !== 0) {
      for (const page of pdfDoc.getPages()) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degreesToRadians((currentRotation + rotateAngle) % 360));
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="edited.pdf"',
      },
    });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { error: "Failed to edit PDF. Please try again." },
      { status: 500 }
    );
  }
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}