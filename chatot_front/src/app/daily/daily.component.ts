import {AfterViewInit, Component, inject} from '@angular/core';
import {SoundPlayerComponent} from '../sound-player/sound-player.component';
import {LanguageService} from '../language.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SnackbarService} from '../snackbar.service';
import {RNGSeedService} from '../rngseed.service';

type Pixel = [number, number, number, number];
type Row = Array<Pixel>;
type BMP = Array<Row>;
type SizedBMP = {
  pixels: BMP,
  width: number,
  height: number,
};

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [
    SoundPlayerComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.scss'
})
export class DailyComponent implements AfterViewInit {

  dexId = 2;

  tries: number[] = [];
  found = false;
  input = '';
  showPropositions = false;

  origImg!: SizedBMP;
  canvas!: HTMLCanvasElement;

  languageManager = inject(LanguageService);
  snackService = inject(SnackbarService);
  rng = inject(RNGSeedService);

  async ngAfterViewInit() {
    const now = new Date();
    // @ts-ignore
    const fullDaysSinceEpoch = Math.floor(now/8.64e7);
    this.rng.seed(fullDaysSinceEpoch);
    this.dexId = this.rng.nextRange(1, this.languageManager.LANGUAGE.length+1);

    this.canvas = document.getElementById('pk_canvas') as HTMLCanvasElement;
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${this.dexId}.png`;
    const blob = await fetch(url).then(response => response.blob());
    const base64 = await this.blobToBase64(blob);
    this.origImg = await this.base64ToPixels(base64);
  }


  try() {
    const dexId = this.languageManager.dexId(this.input);
    if(dexId <= 0) return this.snackService.onNewMessage$.next('Pokémon not found');
    if(this.tries.includes(dexId)) return;

    if(dexId !== this.dexId){
      this.tries.push(dexId);
      this.input = '';
    }
    else{
      this.found = true;
    }
    this.drawSplitImageWithLevel();
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

  split(level = 1) {
    const original_width = this.origImg.width, original_height = this.origImg.height;
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
            const pixel = this.origImg.pixels[y_chunk + y][x_chunk + x];
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

  drawSplitImageWithLevel() {
    const levels = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96].reverse();
    const lvl = this.found ? levels.pop() : levels[this.tries.length - 1];
    const newImg = this.split(lvl);
    if (!newImg) return;

    const canvas = this.canvas;
    const context = canvas.getContext("2d")!;
    canvas.width = this.origImg.width;
    canvas.height = this.origImg.height;
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

}
