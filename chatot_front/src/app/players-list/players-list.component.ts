import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import {HubService} from '../hub.service';
import {map} from 'rxjs';

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
