import { Component, inject, Input } from '@angular/core';
import { Room } from '../../models/room';
import { HubService } from '../hub.service';
import { FormsModule } from '@angular/forms';
import { RoomParams } from '../../models/room-params';
import { SelectButtonComponent } from '../components/select-button/select-button.component';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-room-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonComponent],
  templateUrl: './room-lobby.component.html',
  styleUrl: './room-lobby.component.scss'
})
export class RoomLobbyComponent {

  hub = inject(HubService);

  readonly PPs = [1, 152, 252, 387, 495].flatMap(base_i => new Array(9).fill(0).map((v, i) => i+base_i));
  readonly one_to_nine = new Array(9).fill(0).map((_, i) => i);
  pp_index = 0;

  @Input({required: true}) room !: Room;

  updateParams<K extends keyof RoomParams>(key: K, value: RoomParams[K]){
    this.hub.updateParams({...this.room.params, [key]: value});
  }

  play() {
    this.hub.startRoom();
  }

  get totalDurationText(){
    const totalSeconds = this.room.params.nbRounds * this.room.params.roundDurationSeconds;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes ? minutes + 'm' : ''}${seconds ? seconds +'s' : ''}`
  }

}
