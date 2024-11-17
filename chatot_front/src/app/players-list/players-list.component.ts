import {Component, inject, Input} from '@angular/core';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import {HubService} from '../hub.service';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.scss'
})
export class PlayersListComponent {

  @Input({required: true}) room!: Room;

  hub = inject(HubService);

  copyUrl(){
    navigator.clipboard && navigator.clipboard.writeText(`${window.location.origin}/join/${this.room.code}`)
  }

  get players(){
    return this.room.players;
  }

}
