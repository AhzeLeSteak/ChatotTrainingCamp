import {ChangeDetectionStrategy, Component, computed, effect, viewChild,} from '@angular/core';
import {SoundPlayerComponent} from '../../common/sound-player/sound-player.component';
import {RoomStatus} from '../../../models/room';
import {GameMode} from '../../../models/room-params';
import {MCQComponent} from '../mcq/mcq.component';
import {SilhouetteComponent} from '../silhouette/silhouette.component';
import {room} from '../signals/room';
import {timeElapsedInQuestion} from '../signals/timeElapsedInQuestion';

@Component({
  selector: 'app-play',
  imports: [SoundPlayerComponent, MCQComponent, SilhouetteComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent {

  soundPlayer = viewChild(SoundPlayerComponent);

  room = room();
  roomStatus = computed(() => this.room().status);
  isMCQ = computed(() => this.room().params.gameMode == GameMode.Cry);


  _ = effect(() => {
    if(this.roomStatus() === RoomStatus.Playing) {
      this.soundPlayer()?.play()
    }
  })

  readonly barNb = 15;

  timeElapsed = timeElapsedInQuestion();

  barsArray = computed(() => {
    const room = this.room();
    if (!room.currentQuestion) return null!
    const elapsedMs = this.timeElapsed();
    const roomDurationMs = room.params.roundDurationSeconds * 1000;
    const ratio = 1 - Math.min(elapsedMs, roomDurationMs) / roomDurationMs; // € [0, 1]
    const step = Math.round(ratio * this.barNb);
    return new Array<number>(this.barNb)
      .fill(1, 0, step)
      .fill(0, step, this.barNb);
  });

}
