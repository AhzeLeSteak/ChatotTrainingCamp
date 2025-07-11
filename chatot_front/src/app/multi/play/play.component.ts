import {ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, viewChild,} from '@angular/core';
import {GuessCardComponent} from '../guess-card/guess-card.component';
import {map, timer} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {SoundPlayerComponent} from '../../common/sound-player/sound-player.component';
import {HubService} from '../../../services/hub.service';
import {RoomStatus} from '../../../models/room';


@Component({
  selector: 'app-play',
  imports: [GuessCardComponent, SoundPlayerComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent {

  hub = inject(HubService);
  soundPlayer = viewChild(SoundPlayerComponent);

  room = this.hub.room;
  questionIndex = computed(() => this.room().questionIndex);
  roomStatus = computed(() => this.room().status);

  answer = linkedSignal({
    source: () => this.questionIndex(),
    computation: () => 0
  }); // answer for current question, resets on new question
  startTimer = linkedSignal({
    source: () => this.questionIndex(),
    computation: () => new Date(),
  }); // starting time of current question, resets on new question

  _ = effect(() => {
    if(this.roomStatus() === RoomStatus.Playing) {
      this.soundPlayer()?.play()
    }
  })

  timer = toSignal(
    timer(0, 100).pipe(map(() => new Date())),
    {initialValue: new Date()}
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

  sendAnwser(pkid: number) {
    if (this.answer() > 0 || !this.room().IsPlaying) return;
    this.hub.answer(pkid, new Date().getTime() - this.startTimer().getTime());
    this.answer.set(pkid);
  }

}
