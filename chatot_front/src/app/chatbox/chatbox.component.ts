import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {map} from 'rxjs';
import {HubService} from '../../services/hub.service';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatboxComponent {

  hub = inject(HubService);

  messages = computed(() => this.hub.room$().messages);

  user_message = '';
  readonly text_limit = 50;

  sendMessage() {
    if (this.user_message.length === 0) return;
    this.hub.sendMessage(this.user_message.substring(0, this.text_limit));
    this.user_message = '';
  }

}
