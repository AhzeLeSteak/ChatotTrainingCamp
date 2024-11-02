import { Component, Input } from '@angular/core';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.scss'
})
export class PlayersListComponent {

  @Input({required: true}) room!: Room;

  copyUrl(){
    navigator.clipboard && navigator.clipboard.writeText(`${window.location.origin}/join/${this.room.code}`)
  }

  get players(){
    return this.room.players;
  }

}
