export const levels = [96, 48, 32, 24, 16, 12, 8, 6, 4, 3, 2];

export type Pixel = [number, number, number, number];
export type Row = Array<Pixel>;
export type BMP = Array<Row>;
export type SizedBMP = {
  pixels: BMP,
  width: number,
  height: number,
};
