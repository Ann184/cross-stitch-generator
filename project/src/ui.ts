import { PaletteCollor } from "./palette";

export function toggleLoader(show: boolean) {
    const loader = document.getElementById("loader");
    loader?.classList.toggle('hidden', !show);
}

export function setGenerateButtonState(disabled: boolean) {
    const btn = document.getElementById("buttonGenerate") as HTMLButtonElement;
    const textSpan = document.getElementById("buttonText");
    if (btn) {
        btn.disabled = disabled; 
    }

    if (textSpan) {
            textSpan.textContent = disabled ? "Генерация..." : "Сгенерировать схему";
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

    let canvas = document.getElementById('gridCanvas') as HTMLCanvasElement;
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'gridCanvas';
        container?.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cell-size"));
    canvas.width = data.width * cellSize;
    canvas.height = data.height * cellSize;

    ctx.clearRect(0,0, canvas.width, canvas.height);

    for (let i = 0; i < data.height; i++) {
        for (let j = 0; j < data.width; j++) {
            ctx.fillStyle = data.grid[i][j];
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            
            ctx.strokeStyle = "#e0e0e0";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize)
        }
    }
    container.style.opacity = "1";
}

export function renderPalette(paletteList: PaletteCollor[]) {
    const container = document.getElementById('paletteContainer');
    if (!container) return;
    
    paletteList.forEach((item) => {
        const rgbColor = item.rgb 
            ? `rgb(${item.rgb.map(c => Math.round(c * 255)).join(',')})`
            : item.hex;

        const row = document.createElement('div');
        row.className = 'palette-row';
        
        row.innerHTML = `
            <div class="color-box" style="background-color: ${rgbColor}"></div>
            <div class="color-text">
                <span class="color-name">${item.name || 'Неизвестный'}</span>
                <span class="color-count">${item.count} крестиков</span>
            </div>
        `;
        container.appendChild(row);
    });
}