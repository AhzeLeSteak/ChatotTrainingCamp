import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HubService} from '../../services/hub.service';

@Component({
    selector: 'app-players-list',
    imports: [CommonModule],
    templateUrl: './players-list.component.html',
    styleUrl: './players-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersListComponent {

  hub = inject(HubService);

  room = this.hub.room$;
  players = computed(() => this.room().players)

}
