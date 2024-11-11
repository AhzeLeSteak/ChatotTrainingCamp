import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PK_NAMES } from '../consts/pokemon-names';

@Component({
  selector: 'app-guess-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-card.component.html',
  styleUrl: './guess-card.component.scss'
})
export class GuessCardComponent {

  @Input({required: true}) pkid !: number;
  @Input({required: true}) correct = false; 
  @Input({required: true}) wrong = false; 
  @Input({required: true}) disabled !: boolean;

  @Output() onClick = new EventEmitter();

  get pk_name(){
    return PK_NAMES[this.pkid-1];
  }

}
