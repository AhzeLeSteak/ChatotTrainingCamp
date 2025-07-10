import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuessCardComponent} from '../guess-card/guess-card.component';
import {map, shareReplay, timer} from 'rxjs';
import {SoundPlayerComponent} from '../sound-player/sound-player.component';
import {HubService} from '../../services/hub.service';
import {toSignal} from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-play',
    imports: [CommonModule, GuessCardComponent, SoundPlayerComponent],
    templateUrl: './play.component.html',
    styleUrl: './play.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent {

  hub = inject(HubService);

  answer = signal(0);
  startTimer = new Date();

  room = this.hub.room$;
  questionIndex = computed(() => this.room().questionIndex);

  timer = toSignal(
    timer(0, 100).pipe(map(() => new Date()), shareReplay(1)),
    { initialValue: new Date() }
  );

  readonly barNb = 15;

  barsArray = computed(() => {
    const room = this.room();
    if (!room.currentQuestion) return null!
    const elapsedMs = this.timer().getTime() - room.currentQuestion.startDate.getTime();
    const roomDurationMs = room.params.roundDurationSeconds * 1000;
    const ratio = 1 - Math.min(elapsedMs, roomDurationMs) / roomDurationMs; // € [0, 1]
    const step = Math.round(ratio * this.barNb);
    return new Array<number>(this.barNb)
      .fill(1, 0, step)
      .fill(0, step, this.barNb);
  });

  _ = effect(() => {
    console.log('qi', this.questionIndex());
    this.answer.set(0);
    this.startTimer = new Date();
  })

  sendAnwser(pkid: number) {
    if (this.answer() > 0 || !this.room().IsPlaying) return;
    this.hub.answer(pkid, new Date().getTime() - this.startTimer.getTime());
    this.answer.set(pkid);
  }

}
