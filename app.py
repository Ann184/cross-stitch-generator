from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from image_processor import generate_patterns_from_bytes
import io

app = FastAPI()

@app.post("/generate")
async def generate(file: UploadFile = File(...), scale: int = 20, colors: int = 16):
    image_bytes = await file.read()
    result_image = generate_patterns_from_bytes(image_bytes, scale, colors)
    
    img_byte_arr = io.BytesIO()
    result_image.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)

    return StreamingResponse(img_byte_arr, media_type="image/png")

@app.get("/", response_class=HTMLResponse)
async def get_form():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        return f.read()