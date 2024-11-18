import {Component, inject, Input, OnInit} from '@angular/core';
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
export class RoomLobbyComponent implements OnInit{

  hub = inject(HubService);

  readonly PPs = [1, 152, 252, 387, 495].flatMap(base_i => new Array(9).fill(0).map((v, i) => i+base_i));
  readonly one_to_nine = new Array(9).fill(0).map((_, i) => i);
  pp_index = 0;

  @Input({required: true}) room !: Room;

  ngOnInit() {
    const ppIndex = this.PPs.findIndex(pp => pp === this.room.currentPlayer.profilePicture);
    this.pp_index = ppIndex - ppIndex%9;
  }

  changePP(pp: number){
    if(!this.room.players.some(p => p.profilePicture === pp))
      this.hub.changePP(pp);
  }

  updateParams<K extends keyof RoomParams>(key: K, value: RoomParams[K]){
    //console.log(this.PPs);
    this.hub.updateParams({...this.room.params, [key]: value});
  }

  other_players_ready(){
    return this.room.players.filter(p => !p.isCreator).every(p => p.ready);
  }

  play() {
    if(this.room.currentPlayer.isCreator)
      this.hub.startRoom();
    else
      this.hub.ready();
  }

  isPPUnavailable(pp: number){
    return this.room.players.some(p => p.connectionId !== this.room.currentPlayer.connectionId && p.profilePicture === pp);
  }

  get totalDurationText(){
    const totalSeconds = this.room.params.nbRounds * this.room.params.roundDurationSeconds;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes ? minutes + 'm' : ''}${seconds ? seconds +'s' : ''}`
  }

}
