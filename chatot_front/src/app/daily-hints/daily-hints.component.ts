import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SaveManagerService} from '../save-manager.service';
import {LanguageService} from '../language.service';
import {SearchStatus} from '../daily/daily.component';
import {TYPES} from '../../consts/pokemon-types';

type Pixel = [number, number, number, number];
type Row = Array<Pixel>;
type BMP = Array<Row>;
type SizedBMP = {
  pixels: BMP,
  width: number,
  height: number,
};

@Component({
  selector: 'app-daily-hints',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './daily-hints.component.html',
  styleUrl: './daily-hints.component.scss'
})
export class DailyHintsComponent {
  TYPES = TYPES;

  @Input({required: true}) dexId: number;
  @Input({required: true}) searchStatus: SearchStatus;

  saveManager = inject(SaveManagerService);
  languageManager = inject(LanguageService);

  readonly levels = [96, 48, 32, 24, 16, 12, 8, 6, 4, 3, 2];
  protected readonly SearchStatus = SearchStatus;

  async ngAfterViewInit() {
    const blob = await fetch(this.imgUrl).then(response => response.blob());
    const base64 = await this.blobToBase64(blob);
    const img = await this.base64ToPixels(base64);
    for (let i = 0; i < this.levels.length; i++) {
      setTimeout(() => this.drawSplitImageWithLevel(img, i), 500*(i+1));
    }
  }


  private blobToBase64(blob: Blob) {
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

  base64ToPixels(base64: string) {
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

  drawSplitImageWithLevel(img: SizedBMP, i: number) {
    const lvl = this.levels[i];
    const newImg = this.split(img, lvl);
    if (!newImg) return;

    const canvas = document.querySelector(`#pk_canvas canvas:nth-of-type(${i + 1})`) as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    canvas.width = img.width;
    canvas.height = img.height;
    for (let y = 0; y < newImg.height; y++) {
      for (let x = 0; x < newImg.width; x++) {
        const pixel = newImg.pixels[y][x];
        for (let y_chunk = 0; y_chunk < newImg.chunk_height; y_chunk++) {
          for (let x_chunk = 0; x_chunk < newImg.chunk_width; x_chunk++) {

            const id = context.createImageData(1, 1);
            id.data[0] = pixel[0];
            id.data[1] = pixel[1];
            id.data[2] = pixel[2];
            id.data[3] = pixel[3];
            context.putImageData(id, x * newImg.chunk_width + x_chunk, y * newImg.chunk_height + y_chunk);
          }
        }
      }
    }
  }

  get imgUrl(){
    return `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${this.dexId}.png`
  }

  get tries() {
    return this.saveManager.tries;
  }

  get over(){
    return this.searchStatus !== SearchStatus.Searching;
  }

  get displayHeight(){
    return this.over || this.tries.length > 0;
  }

  get displayFlavor(){
    return this.over || this.tries.length > 1;
  }

  get displayGenera(){
    return this.over || this.tries.length > 2;
  }

  get displayDexId(){
    return this.over || this.tries.length > 3;
  }

  get displayTypes(){
    return this.over || this.tries.length > 4;
  }

}
