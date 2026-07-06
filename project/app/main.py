from fastapi import FastAPI, UploadFile, File, Form
from project.app.image_processor import generate_patterns_from_bytes

app = FastAPI()

@app.post("/generate")
async def generate(file: UploadFile = File(...), width: int = Form(...), colors: int = Form(...)):
    image_bytes = await file.read()
    return generate_patterns_from_bytes(image_bytes, width, colors)