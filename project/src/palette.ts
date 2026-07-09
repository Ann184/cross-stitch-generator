export interface PaletteCollor {
    hex: string;
    count: number;
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