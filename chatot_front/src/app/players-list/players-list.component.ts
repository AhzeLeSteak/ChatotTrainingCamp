import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {map} from 'rxjs';
import {HubService} from '../../services/hub.service';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersListComponent {

  hub = inject(HubService);

  get room$(){
    return this.hub.room$;
  }

  get players$(){
    return this.room$.pipe(
      map(room => room.players),
    );
  }

}
