from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from image_processor import generate_patterns_from_bytes
import io

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/generate")
async def generate(file: UploadFile = File(...), width: int = Form(...), colors: int = Form(...)):
    image_bytes = await file.read()
    result_image = generate_patterns_from_bytes(image_bytes, width, colors)
    return result_image

@app.get("/", response_class=HTMLResponse)
async def get_form():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        return f.read()