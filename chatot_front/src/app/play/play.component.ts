import {ChangeDetectionStrategy, Component, inject, OnInit, signal,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuessCardComponent} from '../guess-card/guess-card.component';
import {combineLatestWith, filter, map, shareReplay, timer} from 'rxjs';
import {SoundPlayerComponent} from '../sound-player/sound-player.component';
import {toSignal} from '@angular/core/rxjs-interop';
import {HubService} from '../../services/hub.service';


const time = timer(0, 100)
  .pipe(map(() => new Date()), shareReplay(1));

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, GuessCardComponent, SoundPlayerComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements OnInit {

  hub = inject(HubService);

  answer = signal(0);
  startTimer = new Date();

  room = toSignal(this.hub.room$, {requireSync: true})

  readonly barNb = 15;

  barsArray$ = time.pipe(
    combineLatestWith(this.hub.room$),
    map(([now, room]) => {
      if(!room.currentQuestion) return null!
      const elapsedMs = now.getTime() - room.currentQuestion.startDate.getTime();
      const roomDurationMs = room.params.roundDurationSeconds * 1000;
      const ratio = 1 - Math.min(elapsedMs, roomDurationMs) / roomDurationMs; // € [0, 1]
      const step = Math.round(ratio * this.barNb);
      return new Array<number>(this.barNb)
        .fill(1, 0, step)
        .fill(0, step, this.barNb);
    }),
    filter(x => !!x)
  )


  ngOnInit() {
    this.hub.onNewQuestion$.subscribe(() => this.onNewQuestion());
  }

  private onNewQuestion() {
    this.answer.set(0);
    this.startTimer = new Date();
  }

  sendAnwser(pkid: number) {
    if (this.answer() > 0 || !this.room().IsPlaying) return;
    this.hub.answer(pkid, new Date().getTime() - this.startTimer.getTime());
    this.answer.set(pkid);
  }

}
