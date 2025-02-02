import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubService, PLAYER_NAME } from '../hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectButtonComponent } from "../components/select-button/select-button.component";
import {CommonModule} from '@angular/common';
import {SnackbarService} from '../snackbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  snackbar = inject(SnackbarService);

  create_join = [{value: false, label: 'Create a room'}, {value: true, label: 'Join a room'}];
  join = false;
  url_mode = false;

  player_name = localStorage.getItem(PLAYER_NAME) ?? '';
  room_code = '';

  constructor(private hub: HubService,
              private route: ActivatedRoute,
              private router: Router
  ){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.room_code = params.get('code') ?? '';

      if(this.room_code){
        this.join = true;
        this.url_mode = true;
      }
    })
  }

  async letsgo(){
    let joined = false;
    if(this.join)
      joined = await this.hub.joinRoom(this.room_code, this.player_name);
    else
      joined = await this.hub.createRoom(this.player_name);
    if(joined)
      this.router.navigate(['play']);
    else if(this.join)
      this.snackbar.onNewMessage$.next(`Unable to join room`);
  }

}
