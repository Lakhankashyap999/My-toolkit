import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from docx import Document
from docx.shared import Pt
import io

app = FastAPI()

@app.post("/convert")
async def convert_pdf_to_word(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    docx_doc = Document()

    for page_num in range(len(pdf_doc)):
        page = pdf_doc[page_num]
        blocks = page.get_text("dict")["blocks"]

        for block in blocks:
            if block["type"] == 0:  # text block
                for line in block["lines"]:
                    line_text = ""
                    max_font_size = 0
                    for span in line["spans"]:
                        line_text += span["text"]
                        if span["size"] > max_font_size:
                            max_font_size = span["size"]
                    if line_text.strip():
                        if max_font_size >= 16:
                            docx_doc.add_heading(line_text.strip(), level=1)
                        else:
                            p = docx_doc.add_paragraph(line_text.strip())
                            p.style.font.size = Pt(max_font_size)

        try:
            tables = page.find_tables()
            for table in tables:
                table_data = table.extract()
                if table_data:
                    rows = len(table_data)
                    cols = len(table_data[0]) if rows > 0 else 0
                    docx_table = docx_doc.add_table(rows=rows, cols=cols)
                    for i, row in enumerate(table_data):
                        for j, cell_text in enumerate(row):
                            docx_table.cell(i, j).text = cell_text or ""
        except Exception as e:
            print(f"Table extraction error: {e}")

    output = io.BytesIO()
    docx_doc.save(output)
    output.seek(0)

    return Response(
        content=output.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=converted.docx"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)