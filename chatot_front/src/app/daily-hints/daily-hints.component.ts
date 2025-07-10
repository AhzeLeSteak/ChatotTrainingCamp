import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  Input,
  Signal
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchStatus} from '../daily/daily.component';
import {TYPES} from '../../consts/pokemon-types';
import {LanguageService} from '../../services/language.service';
import {SaveManagerService} from '../../services/save-manager.service';

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
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './daily-hints.component.html',
    styleUrl: './daily-hints.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyHintsComponent implements AfterViewInit {

  dexId = input.required<number>();
  searchStatus = input.required<SearchStatus>();

  saveManager = inject(SaveManagerService);
  languageManager = inject(LanguageService);

  protected readonly SearchStatus = SearchStatus;
  protected readonly TYPES = TYPES;
  readonly levels = [96, 48, 32, 24, 16, 12, 8, 6, 4, 3, 2];
  loaded = false;
  img: SizedBMP;

  tries = this.saveManager.tries;

  over = computed(() => this.searchStatus() !== SearchStatus.Searching);

  displayHeight = computed(() => this.over() || this.tries().length > 0);
  displayTypes = computed(() => this.over() || this.tries().length > 1);
  displayDexId = computed(() => this.over() || this.tries().length > 2);
  displayGenera = computed(() => this.over() || this.tries().length > 3);
  displayFlavor = computed(() => this.over() || this.tries().length > 4);

  constructor() {
    effect(() => {
      this.drawSplitImageWithLevel(this.saveManager.tries().length);
    });
  }

  async ngAfterViewInit() {
    const blob = await fetch(this.imgUrl).then(response => response.blob());
    const base64 = await this.blobToBase64(blob);
    this.img = await this.base64ToPixels(base64);
    this.drawSplitImageWithLevel(this.saveManager.tries().length - 1);
    this.drawSplitImageWithLevel(this.saveManager.tries().length);
    this.loaded = true;
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

  drawSplitImageWithLevel(i: number) {
    const lvl = this.levels[i];
    console.log({i});
    if (!lvl || !this.img) return;
    const newImg = this.split(this.img, lvl);
    if (!newImg) return;

    const canvas = document.querySelector(`#pk_canvas canvas:nth-of-type(${i + 1})`) as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    canvas.width = this.img.width;
    canvas.height = this.img.height;
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

  get imgUrl() {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${this.dexId()}.png`
  }

}
