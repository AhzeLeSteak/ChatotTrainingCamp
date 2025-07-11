import {CommonModule} from '@angular/common';
import {Component, computed, EventEmitter, inject, input, output, Output} from '@angular/core';
import {LanguageService} from '../../../services/language.service';
import {HubService} from '../../../services/hub.service';

@Component({
    selector: 'app-guess-card',
    imports: [CommonModule],
    templateUrl: './guess-card.component.html',
    styleUrl: './guess-card.component.scss'
})
export class GuessCardComponent {

  pkid = input.required<number>();
  correct = input(false);
  wrong = input(false);
  disabled = input(false);

  onClick = output<void>();

  languageManager = inject(LanguageService);
  room = inject(HubService).room;

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


  fontSize = computed(() =>
    'ko' === this.languageManager.selected_language()
      ? '.8em'
      : '1.2em');

}
