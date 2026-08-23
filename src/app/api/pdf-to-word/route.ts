// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.PDF_CONVERTER_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
    }

    const backendForm = new FormData();
    backendForm.append("file", file);

    const response = await fetch(`${BACKEND_URL}/convert`, {
      method: "POST",
      body: backendForm,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="converted.docx"',
      },
    });
  } catch (error) {
    console.error("PDF to Word error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}