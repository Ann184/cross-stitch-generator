
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

function getCellSize(): number {
    const rootStyles = getComputedStyle(document.documentElement);
    const size = rootStyles.getPropertyValue('--cell-size').replace('px', '');
    return parseInt(size) || 25;
}

function setCellSize(size: number) {
    document.documentElement.style.setProperty('--cell-size', `${size}px`);
}

function zoomIn(): void {
    const currentSize = getCellSize();
    setCellSize(currentSize + 5);
}

function zoomOut(): void {
    const currentSize = getCellSize();
    if (currentSize > 5) {
        setCellSize(currentSize - 5);
    }
}

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

    btn.disabled = true;
    btn.textContent = "Генерация...";

    const loader = document.getElementById("loader");
    loader?.classList.remove('hidden');

    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('width', widthInput.value);
        formData.append('colors', colorsInput.value);

        const response = await fetch('/generate', { method: 'POST', body: formData });
        if (!response.ok) {
            alert("Произошла ошибка обработки изображения. Повторите попытку или выберите другой файл!")
            return
        }
        const data = await response.json();
        renderGrid(data)

    } catch (error) {
        alert("Что-то пошло не так при генерации схемы")
    } finally {
        btn.disabled = false;
        btn.textContent ="Сгенерировать схему";
        loader?.classList.add('hidden');
    }
    
}

interface PatternData {
    grid: string[][];
    width: number;
    height: number;
}

async function renderGrid(data:PatternData){
    const container = document.getElementById('resultContainer');
    if (!container) return;
    container.innerHTML = '';
    container.style.opacity = "0";

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    for (let i = 0; i < data.height; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < data.width; j++) {
            const td = document.createElement('td');
            td.style.backgroundColor = data.grid[i][j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);
    container.style.opacity = "1";
}
