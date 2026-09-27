import {Component, computed, inject, linkedSignal} from '@angular/core';
import {HubService} from '../../../services/hub.service';
import {GuessCardComponent} from '../guess-card/guess-card.component';
import {room} from '../signals/room';

@Component({
  imports: [
    GuessCardComponent
  ],
  selector: 'app-mcq',
  styleUrl: './mcq.component.scss',
  templateUrl: './mcq.component.html',
})
export class MCQComponent {
  hub = inject(HubService);
  room = room();

  questionIndex = computed(() => this.room().questionIndex);

  startTimer = linkedSignal({
    source: () => this.questionIndex(),
    computation: () => new Date(),
  }); // starting time of current question, resets on new question

  answer = linkedSignal({
    source: () => this.questionIndex(),
    computation: () => 0
  }); // answer for current question, resets on new question


  sendAnwser(pkid: number) {
    if (this.answer() > 0 || !this.room().IsPlaying) return;
    this.hub.answer(pkid, new Date().getTime() - this.startTimer().getTime());
    this.answer.set(pkid);
  }
}
