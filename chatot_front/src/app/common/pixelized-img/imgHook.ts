import {resource, Signal} from '@angular/core';

export function pixelizedImage(dexId: Signal<number>){
  return resource({
    params: () => ({dexId: dexId()}),
    loader: async({params}) => {
      const url = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${params.dexId}.png`;
      const blob = await fetch(url).then(response => response.blob());
      const base64 = await blobToBase64(blob);
      return await base64ToPixels(base64);
    }
  })
}

export type PixelationLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export const PIXELATION_LEVELS: Record<PixelationLevel, number> & {MAX: PixelationLevel} = {
  0: 96,
  1: 48,
  2: 32,
  3: 24,
  4: 16,
  5: 12,
  6: 8,
  7: 6,
  8: 4,
  9: 3,
  10: 2,
  11: 1,
  MAX: 11
};


export type Pixel = [number, number, number, number];
export type Row = Array<Pixel>;
export type BMP = Array<Row>;
export type SizedBMP = {
  pixels: BMP,
  width: number,
  height: number,
};


function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      resolve(base64!.toString());
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  })
}



function base64ToPixels(base64: string) {
  return new Promise<SizedBMP>(resolve => {

    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const pixels: BMP = [];
      for (let y = 0; y < img.height; y++) {
        const row: Row = [];
        pixels.push(row);
        for (let x = 0; x < img.width; x++) {
          row.push([...ctx.getImageData(x, y, 1, 1).data as unknown as Pixel])
        }
      }
      resolve({
        pixels,
        width: img.width,
        height: img.height,
      });
    }
    img.src = base64;
  })
}
