import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchStatus} from '../daily/daily.component';
import {SaveManagerService} from '../../../services/save-manager.service';
import {LanguageService} from '../../../services/language.service';
import {TYPES} from '../../../consts/pokemon-types';
import {PIXELATION_LEVELS, PixelationLevel, pixelizedImage} from '../../common/pixelized-img/imgHook';
import {PixelizedImgComponent} from '../../common/pixelized-img/pixelized-img.component';


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
  img = pixelizedImage(this.dexId);

  tries = inject(SaveManagerService).tries;

  levelToDisplay = computed(() => this.searchStatus() !== SearchStatus.Searching
    ? PIXELATION_LEVELS.MAX
    : this.tries().length as PixelationLevel)

  over = computed(() => this.searchStatus() !== SearchStatus.Searching);

  displayHeight = computed(() => this.over() || this.tries().length > 0);
  displayTypes = computed(() => this.over() || this.tries().length > 1);
  displayDexId = computed(() => this.over() || this.tries().length > 2);
  displayGenera = computed(() => this.over() || this.tries().length > 3);
  displayFlavor = computed(() => this.over() || this.tries().length > 4);


}
