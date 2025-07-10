import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {HubService} from '../../../services/hub.service';

@Component({
    selector: 'app-chatbox',
    imports: [FormsModule],
    templateUrl: './chatbox.component.html',
    styleUrl: './chatbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatboxComponent {

  hub = inject(HubService);
  messages = computed(() => this.hub.room$().messages);

  readonly text_limit = 50;
  user_message = signal('');

  sendMessage() {
    if (this.user_message().trim().length === 0) return;
    this.hub.sendMessage(this.user_message().trim().substring(0, this.text_limit));
    this.user_message.set('');
  }

}
