import { PaletteCollor } from "./palette";

let activeColorHex: string | null = null;

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

    // заливка крестиков
    for (let i = 0; i < data.height; i++) {
        for (let j = 0; j < data.width; j++) {
            const cellColor = data.grid[i][j];
            ctx.fillStyle = cellColor;
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

            if (activeColorHex && cellColor !== activeColorHex) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }

            if (activeColorHex === cellColor) {
                ctx.strokeStyle = "#ff8da2";
                ctx.lineWidth = 2;
                ctx.strokeRect(j * cellSize + 1, i * cellSize + 1, cellSize - 2, cellSize - 2);
            }
        }
    }

    // рисуем сетку
    ctx.lineWidth = 0.5;

    // каждая 10 толце и темнее
    for (let i = 1; i < data.height; i++) {
        const isTen = i % 10 === 0;
        ctx.strokeStyle = isTen ? "#141414" : "#333";
        ctx.lineWidth = isTen ? 2 : 0.5;

        ctx.setLineDash(isTen ? [10, 5] : []);
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(data.width * cellSize, i * cellSize);
        ctx.stroke();
    }

    for (let j = 0; j < data.width; j++) {
        const isTen = j % 10 === 0;
        ctx.strokeStyle = isTen ? "#141414" : "#333";
        ctx.lineWidth = isTen ? 2 : 0.5;

        ctx.setLineDash(isTen ? [10, 5] : []);
        ctx.beginPath();
        ctx.moveTo(j * cellSize, 0);
        ctx.lineTo(j * cellSize, data.height * cellSize);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, data.width * cellSize, data.height * cellSize);
}

export function renderPalette(paletteList: PaletteCollor[], patternData: any) {
    const container = document.getElementById('paletteContainer');
    if (!container) return;

    container.innerHTML = '';
    
    paletteList.forEach((item) => {
        const rgbColor = item.rgb 
            ? `rgb(${item.rgb.map(c => Math.round(c * 255)).join(',')})`
            : item.hex;

        const row = document.createElement('div');
        row.className = 'palette-row';
        
        row.innerHTML = `
            <div class="color-box" style="background-color: ${rgbColor}"></div>
            <div class="color-info-wrapper">
                <div class="color-main">
                    <span class="color-name">${item.name || 'Неизвестный'}</span>
                    <span class="color-dmc">DMC ${item.id || '---'}</span>
                </div>
                <span class="color-count">${item.count} крестиков</span>
            </div>
        `;

        row.addEventListener('click', () => {
            activeColorHex = (activeColorHex === item.hex) ? null : item.hex;
            renderGrid(patternData);
            document.querySelectorAll('.palette-row').forEach(el => el.classList.remove('selected'));
            if (activeColorHex) row.classList.add('selected');
        });

        container.appendChild(row);
    });
}

export function setupGridInteractions(data: PatternData, palette: PaletteCollor[]) {
    const canvas = document.getElementById('gridCanvas') as HTMLCanvasElement;
    const tooltip = document.getElementById('tooltip');
    if (!canvas || !tooltip) return;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cell-size"));
  
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);

        if (x >= 0 && x < data.width && y >= 0 && y < data.height) {
            const hex = data.grid[y][x];
            const colorInfo = palette.find(p => p.hex === hex);
            
            if (colorInfo) {
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.top = `${e.clientY + 10}px`;
                tooltip.classList.remove('hidden');
                tooltip.innerHTML = `
                    <div style="font-weight: bold; border-bottom: 1px solid #fff; margin-bottom: 4px; padding-bottom: 2px;">
                        ${colorInfo.name}
                    </div>
                    <div>Номер нити: <strong>${colorInfo.id || 'N/A'}</strong></div>
                    <div>Крестиков: <strong>${colorInfo.count}</strong></div>
                `;
                return;
            }
        }
        tooltip.classList.add('hidden');
    });

    canvas.addEventListener('mouseleave', () => tooltip.classList.add('hidden'));
}