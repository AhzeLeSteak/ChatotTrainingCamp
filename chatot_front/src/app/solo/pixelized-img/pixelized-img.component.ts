import {ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, viewChild} from '@angular/core';
import {BMP, levels, Row, SizedBMP} from './types';


@Component({
  selector: 'app-pixelized-img',
  templateUrl: './pixelized-img.component.html',
  styleUrl: './pixelized-img.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixelizedImgComponent {

  img = input.required<SizedBMP>();
  level = input.required<number>();
  disabled = input(false);

  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  canvas = computed(() => this.canvasRef()?.nativeElement);


  _ = effect(() => {
    const canvas = this.canvas();
    if(canvas && this.img()){
      this.drawSplitImageWithLevel(canvas, this.level());
    }
  });

  drawSplitImageWithLevel(canvas: HTMLCanvasElement, i: number) {
    const lvl = levels[i];
    if (!lvl || !this.img()) return;
    const newImg = this.split(this.img(), lvl);
    if (!newImg) return;

    const context = canvas.getContext("2d")!;
    canvas.width = this.img().width;
    canvas.height = this.img().height;
    for (let y = 0; y < newImg.height; y++) {
      for (let x = 0; x < newImg.width; x++) {
        const pixel = newImg.pixels[y][x];
        const id = context.createImageData(newImg.chunk_width, newImg.chunk_height);
        let j = 0;
        for (let y_chunk = 0; y_chunk < newImg.chunk_height; y_chunk++) {
          for (let x_chunk = 0; x_chunk < newImg.chunk_width; x_chunk++) {
            id.data[j++] = pixel[0];
            id.data[j++] = pixel[1];
            id.data[j++] = pixel[2];
            id.data[j++] = pixel[3];
          }
        }
        context.putImageData(id, x * newImg.chunk_width, y * newImg.chunk_height);
      }
    }
  }

  split(origImg: SizedBMP, level = 1) {
    const original_width = origImg.width, original_height = origImg.height;
    const width = Math.floor(original_width / level);
    const height = Math.floor(original_height / level);

    const chunk_width = original_width / width
    const chunk_height = original_height / height;

    if (chunk_width !== Math.floor(chunk_width)) return;

    const pixels_res: BMP = [];
    for (let y = 0; y < original_height; y += chunk_height) {
      const row: Row = [];
      pixels_res.push(row);
      for (let x = 0; x < original_width; x += chunk_width) {
        let r = 0, g = 0, b = 0, a = 0;
        let pixel_count = 0;
        for (let y_chunk = 0; y_chunk < chunk_height; y_chunk++) {
          for (let x_chunk = 0; x_chunk < chunk_width; x_chunk++) {
            const pixel = origImg.pixels[y_chunk + y][x_chunk + x];
            if (pixel[3] === 0) continue;
            r += pixel[0];
            g += pixel[1];
            b += pixel[2];
            a += pixel[3];
            pixel_count++;
          }
        }
        row.push([
          Math.floor(r / pixel_count),
          Math.floor(g / pixel_count),
          Math.floor(b / pixel_count),
          Math.floor(a / pixel_count)
        ]);
      }
    }

    return {
      pixels: pixels_res,
      width,
      height,
      chunk_width,
      chunk_height,
    }
  }

}
