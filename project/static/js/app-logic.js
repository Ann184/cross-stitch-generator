"use strict";
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("buttonGenerate")?.addEventListener("click", generateImage);
    document.querySelectorAll(".buttonZoom").forEach(btn => {
        btn.addEventListener("click", (event) => {
            const action = event.target.dataset.action;
            if (action === "in") {
                zoomIn();
            }
            else {
                zoomOut();
            }
        });
    });
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    fileInput?.addEventListener('change', (event) => {
        const input = event.target;
        if (fileNameDisplay) {
            fileNameDisplay.textContent = (input.files && input.files.length > 0)
                ? input.files[0].name
                : "Файл не выбран";
        }
    });
});
function getCellSize() {
    const rootStyles = getComputedStyle(document.documentElement);
    const size = rootStyles.getPropertyValue('--cell-size').replace('px', '');
    return parseInt(size) || 25;
}
function setCellSize(size) {
    document.documentElement.style.setProperty('--cell-size', `${size}px`);
}
function zoomIn() {
    const currentSize = getCellSize();
    setCellSize(currentSize + 5);
}
function zoomOut() {
    const currentSize = getCellSize();
    if (currentSize > 5) {
        setCellSize(currentSize - 5);
    }
}
async function generateImage() {
    const fileInput = document.getElementById('fileInput');
    const widthInput = document.getElementById('width');
    const colorsInput = document.getElementById('colors');
    if (!fileInput.files || fileInput.files.length === 0)
        return;
    const btn = document.getElementById("buttonGenerate");
    if (!btn) {
        return;
    }
    btn.disabled = true;
    btn.textContent = "Генерация...";
    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('width', widthInput.value);
        formData.append('colors', colorsInput.value);
        const response = await fetch('/generate', { method: 'POST', body: formData });
        if (!response.ok) {
            alert("Произошла ошибка обработки изображения. Повторите попытку или выберите другой файл!");
            return;
        }
        const data = await response.json();
        renderGrid(data);
    }
    catch (error) {
        alert("Что-то пошло не так при генерации схемы");
    }
    finally {
        btn.disabled = false;
        btn.textContent = "Сгенерировать схему";
    }
}
async function renderGrid(data) {
    const container = document.getElementById('resultContainer');
    if (!container)
        return;
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
