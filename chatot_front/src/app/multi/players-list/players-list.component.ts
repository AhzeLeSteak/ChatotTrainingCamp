import {ChangeDetectionStrategy, Component, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {room} from '../signals/room';

@Component({
    selector: 'app-players-list',
    imports: [CommonModule],
    templateUrl: './players-list.component.html',
    styleUrl: './players-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersListComponent {

  room = room();
  players = computed(() => this.room().players)

}
