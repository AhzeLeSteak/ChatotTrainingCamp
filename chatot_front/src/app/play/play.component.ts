import {Component, inject, Input, OnInit,} from '@angular/core';
import {Room} from '../../models/room';
import {CommonModule} from '@angular/common';
import {HubService} from '../hub.service';
import {GuessCardComponent} from '../guess-card/guess-card.component';
import {map, shareReplay, timer} from 'rxjs';
import {SoundPlayerComponent} from '../sound-player/sound-player.component';


const time = timer(0, 100)
  .pipe(map(() => new Date()), shareReplay(1));

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, GuessCardComponent, SoundPlayerComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit{

  hub = inject(HubService);

  @Input({required: true}) room !: Room;

  answer = 0;
  startTimer = new Date();

  readonly barNb = 15;


  ngOnInit() {
    this.hub.$onNewQuestion.subscribe(() => this.onNewQuestion());
  }

  private onNewQuestion(){
    this.answer = 0;
    this.startTimer = new Date();
  }

  sendAnwser(pkid: number){
    if(this.answer > 0 || !this.room.IsPlaying) return;
    this.hub.answer(pkid, new Date().getTime() - this.startTimer.getTime());
    this.answer = pkid;
  }

  get barsArray$(){
    return time.pipe(map(now => {
      const elapsedMs = now.getTime() - this.room.currentQuestion.startDate.getTime();
      const roomDurationMs = this.room.params.roundDurationSeconds * 1000;
      const ratio = 1 - Math.min(elapsedMs, roomDurationMs) / roomDurationMs; // € [0, 1]
      const step = Math.round(ratio * this.barNb);
      return new Array(this.barNb)
        .fill(1, 0, step)
        .fill(0, step, this.barNb);
    }))
  }

}
