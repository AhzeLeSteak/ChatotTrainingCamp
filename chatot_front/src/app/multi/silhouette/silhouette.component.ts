import {Component, computed, inject} from '@angular/core';
import {room} from '../signals/room';
import {currentQuestion} from '../signals/currentQuestion';
import {PixelizedImgComponent} from '../../common/pixelized-img/pixelized-img.component';
import {timeElapsedInQuestion} from '../signals/timeElapsedInQuestion';
import {PIXELATION_LEVELS, PixelationLevel} from '../../common/pixelized-img/imgHook';
import {NgClass, NgStyle} from '@angular/common';
import {LanguageService} from '../../../services/language.service';
import {fontSize} from '../signals/fontSize';
import {RoomStatus} from '../../../models/room';

@Component({
  imports: [
    PixelizedImgComponent,
    NgStyle,
    NgClass
  ],
  selector: 'app-silhouette',
  styleUrl: './silhouette.component.scss',
  templateUrl: './silhouette.component.html',
})
export class SilhouetteComponent {
  readonly room = room();
  readonly currentQuestion = currentQuestion();
  readonly timeElapsed = timeElapsedInQuestion();
  readonly languageManager = inject(LanguageService);

  readonly levelOfPixelization = computed(() => {
    const room = this.room();
    if(room.status == RoomStatus.Answers) return PIXELATION_LEVELS.MAX;
    const elapsedMs = this.timeElapsed();
    const roomDurationMs = room.params.roundDurationSeconds * 750;
    let ratio = Math.min(elapsedMs, roomDurationMs) / roomDurationMs; // € [0, 1]
    return (5 + Math.floor(6*ratio)) as PixelationLevel;
  });

  readonly pk_name = computed(() =>
    this.room()?.isInAnswers
      ? this.languageManager.name_from_id(this.currentQuestion().propositions[0])
      : '???'
  );

  fontSize = fontSize();

}
