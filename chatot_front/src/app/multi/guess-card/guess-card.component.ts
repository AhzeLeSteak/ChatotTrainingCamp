import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input, output} from '@angular/core';
import {LanguageService} from '../../../services/language.service';
import {room} from '../signals/room';
import {fontSize} from '../signals/fontSize';

@Component({
    selector: 'app-guess-card',
    imports: [CommonModule],
    templateUrl: './guess-card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './guess-card.component.scss'
})
export class GuessCardComponent {

  pkid = input.required<number>();
  correct = input(false);
  wrong = input(false);
  disabled = input(false);

  onClick = output<void>();

  languageManager = inject(LanguageService);
  room = room();

  pk_name = computed(() =>
    this.room()?.isInTimer
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
