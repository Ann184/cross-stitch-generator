import paletteData from '../assets/dmc_palette.json';

export interface PaletteCollor {
    hex: string;
    count: number;
    id?: string,
    name?: string;
    rgb?: number[];
}

export function getCountColor(grid: string[][]): PaletteCollor[]{
    const colorMap = new Map();
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const color = grid[i][j];

            colorMap.set(color, (colorMap.get(color) || 0) + 1);
        }
    }

    const result: PaletteCollor[] = [];
    for (const [hex, count] of colorMap.entries()) {
        result.push({ hex, count });
    }

    return result.sort((a, b) => b.count - a.count);
}

function getDistance(rgb1: number[], rgb2: number[]) {
    return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
}

// Превращаем HEX в RGB [r, g, b] (значения 0-255)
function hexToRgb(hex: string): number[] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

export function enrichPalette(counts: PaletteCollor[]) {
    return counts.map(item => {
        const serverRgb = hexToRgb(item.hex);
        
        let minDistance = Infinity;
        let bestMatch = { id: "0", name: "Unknown", rgb: [0, 0, 0] };

        // Ищем в нашем JSON наиболее похожий цвет
        for (const id in paletteData) {
            const entry = (paletteData as any)[id];
            const paletteRgb = entry.rgb.map((c: number) => c * 255);
            
            const dist = getDistance(serverRgb, paletteRgb);
            if (dist < minDistance) {
                minDistance = dist;
                bestMatch = { ...entry, id };
            }
        }

        return {
            ...item,
            id: bestMatch.id,
            name: bestMatch.name,
            rgb: bestMatch.rgb
        };
    });
}