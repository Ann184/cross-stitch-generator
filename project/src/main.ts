import { uploadImage } from './api.js';
import { toggleLoader, setGenerateButtonState, renderGrid, zoomIn, zoomOut } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("buttonGenerate")?.addEventListener("click", generateImage);

    document.querySelectorAll(".buttonZoom").forEach(btn =>{
        btn.addEventListener("click", (event) => {
            const action = (event.target as HTMLElement).dataset.action;
            if (action === "in") {
                zoomIn();
            } else {
                zoomOut();
            }
        })
    })

    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');

    fileInput?.addEventListener('change', (event) => {
        const input = event.target as HTMLInputElement;
        if (fileNameDisplay) {
            fileNameDisplay.textContent = (input.files && input.files.length > 0) 
                ? input.files[0].name 
                : "Файл не выбран";
        }
    });
})

async function generateImage(): Promise<void> {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const widthInput = document.getElementById('width') as HTMLInputElement;
    const colorsInput = document.getElementById('colors') as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) return;

    if (Number(widthInput.value) < 5) {
            alert("Размер сетки не может быть меньше 5!")
            return
        } else if (Number(colorsInput.value) < 1) {
            alert("Цветов не может быть меньше 1!")
            return
        }
    

    const btn = document.getElementById("buttonGenerate") as HTMLInputElement;
    if (!btn) {return}

    setGenerateButtonState(true);
    toggleLoader(true);

    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('width', widthInput.value);
        formData.append('colors', colorsInput.value);

        const data = await uploadImage(formData);
        renderGrid(data)

    } catch (error) {
        alert("Что-то пошло не так при генерации схемы")
    } finally {
        setGenerateButtonState(false);
        toggleLoader(false);
    }
    
}
