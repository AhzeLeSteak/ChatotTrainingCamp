import { Component, inject, Input, OnInit } from '@angular/core';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import { HubService } from '../hub.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit{

  hub = inject(HubService);

  @Input({required: true}) room !: Room;

  timerWidth = '100';

  ngOnInit() {
    setInterval(() => this.timerWidth = this.calcTimerWidth(), 200);
  }

  sendAnwser(pkid: number){
    if(this.answer > 0) return;
    this.hub.answer(pkid);
  }

  private calcTimerWidth(){
    const elapsedMilliseconds = new Date().getTime() - this.room.currentQuestion.startDate.getTime();
    const durationMilliseconds = this.room.params.roundDurationSeconds * 1000;
    const remainingTime = Math.max(0, durationMilliseconds - elapsedMilliseconds);
    return (100 * remainingTime / durationMilliseconds).toFixed();
  }

  get answer(){
    return this.room.currentPlayer.answers[this.room.questionIndex];
  }

}
