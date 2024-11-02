import { Component, inject, OnInit } from '@angular/core';
import { HubService } from '../hub.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { RoomLobbyComponent } from "../room-lobby/room-lobby.component";
import { ChatboxComponent } from "../chatbox/chatbox.component";
import { PlayersListComponent } from "../players-list/players-list.component";
import { PlayComponent } from "../play/play.component";
import { Router } from '@angular/router';
import { ScoresComponent } from "../scores/scores.component";
import { EMOTIONS } from '../../models/player';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, InputTextModule, RoomLobbyComponent, ChatboxComponent, PlayersListComponent, PlayComponent, ScoresComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent implements OnInit{

  hub = inject(HubService);
  router = inject(Router);

  emotions = EMOTIONS;

  ngOnInit(): void {
    if(!this.hub.inRoom)
      this.router.navigate(['']);
  }

  get $room(){
    return this.hub.$room;
  }

}
