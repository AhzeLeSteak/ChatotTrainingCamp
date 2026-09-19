import {ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {SnackbarService} from '../../services/snackbar.service';
import {HubService, PLAYER_NAME} from '../../services/hub.service';
import {SelectButtonComponent} from '../common/select-button/select-button.component';
import {HttpClientModule, httpResource} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, HttpClientModule, SelectButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  readonly create_join = [{value: false, label: 'Create a room'}, {value: true, label: 'Join a room'}];

  snackbar = inject(SnackbarService);
  hub = inject(HubService);
  router = inject(Router);
  code_from_route = inject(ActivatedRoute).snapshot.params['code'];

  join = signal(!!this.code_from_route);
  url_mode = signal(!!this.code_from_route);

  player_name = signal(localStorage.getItem(PLAYER_NAME) ?? '');
  room_code = signal(this.code_from_route ?? '');

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


  blob = httpResource.blob(() => ({
    url: '/gardevoir.png',
  }));

  _ = effect(async () => {
    if(this.blob.hasValue())
      console.log(await createImageBitmap(this.blob.value()))
  })

  base64 = resource({
    params: () => this.blob.hasValue() ? this.blob.value() : null,
    loader: async ({params: blob}) => {
      if (blob) {
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
      }
      return '';
    }
  });

}
