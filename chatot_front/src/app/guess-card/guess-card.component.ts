import { CommonModule } from '@angular/common';
import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Room} from '../../models/room';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-guess-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-card.component.html',
  styleUrl: './guess-card.component.scss'
})
export class GuessCardComponent {

  @Input() room  ?: Room;
  @Input({required: true}) pkid !: number;
  @Input() correct = false;
  @Input() wrong = false;
  @Input() disabled !: boolean;

  @Output() onClick = new EventEmitter();

  languageManager = inject(LanguageService);

  get pk_name(){
    return this.room?.isInTimer
      ? '?'
      : this.languageManager.name(this.pkid);
  }

  get img_url(){
    return this.room?.isInTimer
      ? '/questionmark.png'
      : `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${this.pkid}.png`;
  }

  get players(){
    const i = this.room!.questionIndex;
    return this.room!.players
      .filter(p => p.answers[i] && p.answers[i].pkId === this.pkid)
      .toSorted((a, b) => a.answers[i].timeInMs - b.answers[i].timeInMs);
  }

  get fontSize(){
    return 'ko' === this.languageManager.selected_language
      ? '.8em'
      : '1.2em';
  }

}
