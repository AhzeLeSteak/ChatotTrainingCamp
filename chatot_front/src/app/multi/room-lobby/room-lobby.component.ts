import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SelectButtonComponent} from '../../common/select-button/select-button.component';
import {HubService} from '../../../services/hub.service';
import {RoomParams} from '../../../models/room-params';


@Component({
    selector: 'app-room-lobby',
    imports: [CommonModule, FormsModule, SelectButtonComponent],
    templateUrl: './room-lobby.component.html',
    styleUrl: './room-lobby.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomLobbyComponent implements OnInit{

  hub = inject(HubService);

  readonly PPs = [1, 152, 252, 387, 495].flatMap(base_i => new Array(9).fill(0).map((v, i) => i+base_i));
  readonly one_to_nine = new Array(9).fill(0).map((_, i) => i);

  pp_index = signal(0);
  url_copied = signal(false);

  room = this.hub.room;
  other_players_ready = computed(() => this.room().players.filter(p => !p.isCreator).every(p => p.ready));
  totalDurationText = computed(() => {
    const totalSeconds = this.room().params.nbRounds * this.room().params.roundDurationSeconds;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes ? minutes + 'm' : ''}${seconds ? seconds +'s' : ''}`
  });

  ngOnInit() {
    const ppIndex = this.PPs.findIndex(pp => pp === this.room().currentPlayer.profilePicture);
    this.pp_index.set(ppIndex - ppIndex%9);
  }

  changePP(pp: number){
    if(!this.room().players.some(p => p.profilePicture === pp))
      this.hub.changePP(pp);
  }

  updateParams<K extends keyof RoomParams>(key: K, value: RoomParams[K]){
    console.log(key, value);
    this.hub.updateParams({...this.room().params, [key]: value});

  }


  async copyUrl(){
    await navigator.clipboard.writeText(this.room().url);
    this.url_copied.set(true);
  }

  play() {
    if(this.room().currentPlayer.isCreator)
      this.hub.startRoom();
    else
      this.hub.ready();
  }

  isPPUnavailable(pp: number){
    return this.room().players.some(p => p.connectionId !== this.room().currentPlayer.connectionId && p.profilePicture === pp);
  }

}
