import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input, output} from '@angular/core';
import {LanguageService} from '../../../services/language.service';
import {room} from '../signals/room';
import {fontSize} from '../signals/fontSize';
import {PIXELATION_LEVELS, PixelationLevel} from '../../common/pixelized-img/imgHook';
import {PixelizedImgComponent} from '../../common/pixelized-img/pixelized-img.component';

@Component({
    selector: 'app-guess-card',
  imports: [CommonModule, PixelizedImgComponent],
    templateUrl: './guess-card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './guess-card.component.scss'
})
export class GuessCardComponent {

  pkid = input.required<number>();
  correct = input(false);
  wrong = input(false);
  disabled = input(false);
  levelOfPixelization = input<PixelationLevel>(PIXELATION_LEVELS.MAX);
  hideName = input(false);
  pk_style = input('');


  shouldBePixeled = computed(() => this.levelOfPixelization() !== PIXELATION_LEVELS.MAX);

  onClick = output<void>();

  languageManager = inject(LanguageService);
  room = room();

  pk_name = computed(() =>
    this.hideName()
      ? '?'
      : this.languageManager.name_from_id(this.pkid()));

  players = computed(() => {
    const i = this.room().questionIndex;
    return this.room().players
      .filter(p => p.answers[i] && p.answers[i].pkId === this.pkid())
      .toSorted((a, b) => a.answers[i].timeInMs - b.answers[i].timeInMs);
  });

  img_url = computed(() =>
    this.room()?.isInTimer
      ? '/questionmark.png'
      : `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${this.pkid()}.png`);


  fontSize = fontSize();

}
