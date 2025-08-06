import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {SnackbarService} from '../../services/snackbar.service';
import {HubService, PLAYER_NAME} from '../../services/hub.service';
import {SelectButtonComponent} from '../common/select-button/select-button.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, SelectButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  readonly create_join = [{value: false, label: 'Create a room'}, {value: true, label: 'Join a room'}];

  snackbar = inject(SnackbarService);
  hub = inject(HubService);
  router = inject(Router);
  code_from_route = inject(ActivatedRoute).snapshot.params['code'];

  join = signal(!!this.code_from_route);
  url_mode = signal(!!this.code_from_route);

  player_name = signal(localStorage.getItem(PLAYER_NAME) ?? '');
  room_code = signal(this.code_from_route ?? '');


  async ngOnInit() {
    await this.hub.createConnection();
    const rejoined = await this.hub.tryRejoin();
    if (rejoined) {
      console.log('Rejoined room');
      await this.router.navigate(['play']);
    } else if (this.router.url === '/play') {
      await this.router.navigate(['']);
    }
  }

  async letsgo() {
    let joined = false;
    if (this.join())
      joined = await this.hub.joinRoom(this.room_code(), this.player_name());
    else
      joined = await this.hub.createRoom(this.player_name());
    if (joined)
      this.router.navigate(['play']);
    else if (this.join())
      this.snackbar.onNewMessage$.next(`Unable to join room`);
  }

}
