import {ChangeDetectionStrategy, Component, computed, inject, input, resource, signal,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchStatus} from '../daily/daily.component';
import {SaveManagerService} from '../../../services/save-manager.service';
import {LanguageService} from '../../../services/language.service';
import {TYPES} from '../../../consts/pokemon-types';
import {BMP, Pixel, Row, SizedBMP} from '../pixelized-img/types';
import {PixelizedImgComponent} from '../pixelized-img/pixelized-img.component';
import {httpResource} from '@angular/common/http';


@Component({
  selector: 'app-daily-hints',
  imports: [
    CommonModule,
    FormsModule,
    PixelizedImgComponent,
  ],
  templateUrl: './daily-hints.component.html',
  styleUrl: './daily-hints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyHintsComponent {

  protected readonly SearchStatus = SearchStatus;
  protected readonly TYPES = TYPES;

  dexId = input.required<number>();
  searchStatus = input.required<SearchStatus>();

  languageManager = inject(LanguageService);
  loaded = signal(false);

  tries = inject(SaveManagerService).tries;

  imgUrl = computed(() => `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${this.dexId()}.png`)
  imgBlob = httpResource.blob(() => this.imgUrl())
  img = resource({
    params: () => this.imgBlob.value(),
    loader: async ({params}) => {
      if(!params) return undefined;
      const base64 = await this.blobToBase64(params);
      this.loaded.set(true);
      return await this.base64ToPixels(base64);
    }
  })


  levelsToDisplay = computed(() =>
    this.searchStatus() !== SearchStatus.Searching || !this.img.value()
      ? []
      : [this.tries().length - 1, this.tries().length]
  );

  over = computed(() => this.searchStatus() !== SearchStatus.Searching);

  displayHeight = this.computeDisplayForStep(0);
  displayDexId = this.computeDisplayForStep(1);
  displayGenera = this.computeDisplayForStep(2);
  displayTypes = this.computeDisplayForStep(3);
  displayFlavor = this.computeDisplayForStep(4)

  private computeDisplayForStep(n: number) {
    return computed(() => this.over() || this.tries().length > n);
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


}
