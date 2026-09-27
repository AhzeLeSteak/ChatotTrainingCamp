import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {PixelationLevel, pixelizedImage} from './imgHook';
import {PixelizedImgAuxComponent} from './pixelized-img-aux.component';


@Component({
  selector: 'app-pixelized-img',
  imports: [
    PixelizedImgAuxComponent
  ],
  template: `
    @for (level of levelsToDisplay(); track level; let first = $first) {
      <app-pixelized-img-aux [img]="bmp.value()!" [pixelationLevel]="level" [hidden]="!first"/>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixelizedImgComponent {

  dexId = input.required<number>();
  pixelationLevel = input.required<PixelationLevel>();

  bmp = pixelizedImage(this.dexId);
  levelsToDisplay = computed(() => [this.pixelationLevel(), this.pixelationLevel() + 1 as PixelationLevel])

}
