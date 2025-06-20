import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, Input, OnInit} from '@angular/core';
import {Emotion, EMOTIONS, Player} from '../../models/player';
import {Room} from '../../models/room';
import {HubService} from '../hub.service';
import {map} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoresComponent {

  hub = inject(HubService);

  playersSorted = toSignal(this.hub.room$.pipe(
    map(({players}) => players.toSorted((p1, p2) => p2.points - p1.points))
  ), {requireSync: true});

  emotions$ = computed(() => {
    const players = this.playersSorted();
    if (players.length === 1)
      return [Emotion.Joyous];

    let emotions = [...EMOTIONS];
    for (let i = players.length; i < EMOTIONS.length; i++) {
      emotions.splice(Math.floor(emotions.length / 2), 1);
    }
    return emotions;
  })


  replay() {
    this.hub.replay();
  }


}
