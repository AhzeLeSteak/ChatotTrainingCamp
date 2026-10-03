import {Component, computed} from '@angular/core';
import {room} from '../signals/room';
import {currentQuestion} from '../signals/currentQuestion';
import {timeElapsedInQuestion} from '../signals/timeElapsedInQuestion';
import {PIXELATION_LEVELS, PixelationLevel} from '../../common/pixelized-img/imgHook';
import {RoomStatus} from '../../../models/room';
import {GuessCardComponent} from '../guess-card/guess-card.component';

@Component({
  imports: [
    GuessCardComponent
  ],
  selector: 'app-silhouette',
  styleUrl: './silhouette.component.scss',
  templateUrl: './silhouette.component.html',
})
export class SilhouetteComponent {
  readonly room = room();
  readonly currentQuestion = currentQuestion();
  readonly timeElapsed = timeElapsedInQuestion();
  readonly answer = computed(() => this.currentQuestion().answer)

  readonly levelOfPixelization = computed(() => {
    const room = this.room();
    if(room.status == RoomStatus.Answers) return PIXELATION_LEVELS.MAX;
    const elapsedMs = this.timeElapsed();
    const roomDurationMs = room.params.roundDurationSeconds * 500;
    let ratio = Math.min(elapsedMs, roomDurationMs) / roomDurationMs; // € [0, 1]
    return (5 + Math.floor(6*ratio)) as PixelationLevel;
  });

}
