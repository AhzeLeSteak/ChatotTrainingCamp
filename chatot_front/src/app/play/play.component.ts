import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import { HubService } from '../hub.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit{

  hub = inject(HubService);

  @Input({required: true}) room !: Room;

  answer = 0;
  startTimer = new Date();
  

  ngOnInit() {
    this.hub.$onNewQuestion.subscribe(() => this.onNewQuestion());
  }

  private onNewQuestion(){
    this.answer = 0;
    this.startTimer = new Date();
  }

  sendAnwser(pkid: number){
    if(this.answer > 0) return;
    this.hub.answer(pkid, new Date().getTime() - this.startTimer.getTime());
    this.answer = pkid;
  }


}
