
async function generateImage(): Promise<void> {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const widthInput = document.getElementById('width') as HTMLInputElement;
    const colorsInput = document.getElementById('colors') as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) return;

    const btn = document.querySelector("button");
    if (!btn) {return}

    btn.disabled = true;
    btn.textContent = "Генерация...";

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
}
