import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';

import {RoomLobbyComponent} from "../room-lobby/room-lobby.component";
import {ChatboxComponent} from "../chatbox/chatbox.component";
import {PlayersListComponent} from "../players-list/players-list.component";
import {PlayComponent} from "../play/play.component";
import {Router} from '@angular/router';
import {ScoresComponent} from "../scores/scores.component";
import {EMOTIONS} from '../../models/player';
import {HubService} from '../../services/hub.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [RoomLobbyComponent, ChatboxComponent, PlayersListComponent, PlayComponent, ScoresComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent implements OnInit{

  hub = inject(HubService);
  router = inject(Router);

  readonly emotions = EMOTIONS;

  room = this.hub.room$;

  ngOnInit(): void {
    if(!this.hub.inRoom)
      this.router.navigate(['']);
  }

}
