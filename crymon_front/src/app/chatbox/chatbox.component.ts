import { Component, inject, Input } from '@angular/core';
import { Room } from '../../models/room';
import { HubService } from '../hub.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputGroupModule, ButtonModule],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.scss'
})
export class ChatboxComponent {

  hub = inject(HubService);

  @Input({required: true}) room !: Room;

  user_message = '';
  readonly text_limit = 50;

  sendMessage(){
    this.hub.sendMessage(this.user_message.substring(0, this.text_limit));
    this.user_message = '';
  }

  get messages(){
    return this.room.messages;
  }
  
}
