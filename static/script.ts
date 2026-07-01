
async function generateImage(): Promise<void> {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const widthInput = document.getElementById('width') as HTMLInputElement;
    const colorsInput = document.getElementById('colors') as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) return;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('width', widthInput.value);
    formData.append('colors', colorsInput.value);

    const response = await fetch('/generate', { method: 'POST', body: formData });
    const blob = await response.blob();
    
    const img = document.getElementById('resultImage') as HTMLImageElement;
    img.src = URL.createObjectURL(blob);
    img.style.display = 'block';
}