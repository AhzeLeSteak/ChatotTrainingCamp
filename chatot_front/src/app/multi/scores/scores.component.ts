import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {HubService} from '../../../services/hub.service';
import {Emotion, EMOTIONS} from '../../../models/player';

@Component({
    selector: 'app-scores',
    imports: [CommonModule],
    templateUrl: './scores.component.html',
    styleUrl: './scores.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoresComponent {

  hub = inject(HubService);

  playersSorted = computed(() => this.hub.room$().players.toSorted((p1, p2) => p2.points - p1.points));

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
