import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Emotion, EMOTIONS } from '../../models/player';
import { Room } from '../../models/room';
import { HubService } from '../hub.service';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.scss'
})
export class ScoresComponent implements OnInit{

  hub = inject(HubService);

  @Input({required: true}) room !: Room;

  emotions: string[];

  ngOnInit(): void {
    if(this.room.players.length === 1){
      this.emotions = [Emotion.Joyous];
      return;
    }

    this.emotions = [...EMOTIONS];
    for(let i = this.room.players.length; i < EMOTIONS.length; i++)
      this.emotions.splice(Math.floor(this.emotions.length/2), 1);
  }

  replay(){
    this.hub.replay();
  }

  get playerSorted(){
    return this.room.players.toSorted((p1, p2) => p2.points - p1.points)
    //return emotions.map((_, i) => new Player({name: 'Frite '+i, profilePicture: 3}))
  }


}
