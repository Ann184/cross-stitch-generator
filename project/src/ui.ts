export function toggleLoader(show: boolean) {
    const loader = document.getElementById("loader");
    loader?.classList.toggle('hidden', !show);
}

export function setGenerateButtonState(disabled: boolean) {
    const btn = document.getElementById("buttonGenerate") as HTMLButtonElement;
    if (btn) {
        btn.disabled = disabled;
        btn.textContent = disabled ? "Генерация..." : "Сгенерировать схему";
    }
}

function getCellSize(): number {
    const rootStyles = getComputedStyle(document.documentElement);
    const size = rootStyles.getPropertyValue('--cell-size').replace('px', '');
    return parseInt(size) || 25;
}

function setCellSize(size: number) {
    document.documentElement.style.setProperty('--cell-size', `${size}px`);
}

export function zoomIn(): void {
    const currentSize = getCellSize();
    setCellSize(currentSize + 5);
}

export function zoomOut(): void {
    const currentSize = getCellSize();
    if (currentSize > 5) {
        setCellSize(currentSize - 5);
    }
}

interface PatternData {
    grid: string[][];
    width: number;
    height: number;
}

export async function renderGrid(data:PatternData){
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