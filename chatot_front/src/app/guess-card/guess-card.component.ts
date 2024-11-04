import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-guess-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-card.component.html',
  styleUrl: './guess-card.component.scss'
})
export class GuessCardComponent {

  @Input({required: true}) pkid !: number;
  @Input() correct : boolean = false;
  @Input() wrong : boolean = false;

  @Output() onClick = new EventEmitter();
  
}
