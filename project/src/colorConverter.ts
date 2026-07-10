import palette from '../assets/dmc_palette.json';

// Функция для вычисления расстояния между цветам
const getDistance = (rgb1: number[], rgb2: number[]) => {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
};

export const findNearestDmc = (pixelRgb: number[]): string | null => {
  let minDistance = Infinity;
  let nearestId: string | null = null;

  for (const [id, colorData] of Object.entries(palette)) {
    // Внимание: в JSON у нас 0-1, приводим к 0-255 для сравнения
    const paletteRgb = colorData.rgb.map((c:number) => c * 255);
    const distance = getDistance(pixelRgb, paletteRgb);

    if (distance < minDistance) {
      minDistance = distance;
      nearestId = id;
    }
  }
  return nearestId;
};