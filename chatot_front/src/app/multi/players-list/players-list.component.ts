import {ChangeDetectionStrategy, Component, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {room} from '../signals/room';
import {SoundPlayerComponent} from '../../common/sound-player/sound-player.component';

@Component({
    selector: 'app-players-list',
  imports: [CommonModule, SoundPlayerComponent],
    templateUrl: './players-list.component.html',
    styleUrl: './players-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersListComponent {

  room = room();
  players = computed(() => this.room().players)

}
