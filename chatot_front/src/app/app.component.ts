import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HubService} from './hub.service';
import {FormsModule} from '@angular/forms';
import {SoundManagerService} from './sound-manager.service';
import {VolumeBinderDirective} from './volume-binder.directive';
import {LanguageService} from './language.service';
import {GuessCardComponent} from './guess-card/guess-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, VolumeBinderDirective, GuessCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{


  hub = inject(HubService);
  router = inject(Router);
  soundManager = inject(SoundManagerService);
  languageManager = inject(LanguageService);


  async ngOnInit() {
    await this.hub.createConnection();
    const rejoined = await this.hub.tryRejoin();
    if(rejoined)
      this.router.navigate(['play']);
  }

  async home(){
    if(this.hub.inRoom && confirm("Leave room ?"))
      await this.hub.quitRoom();
    this.router.navigate(['']);
  }

  get array(){
    return new Array(20)
      .fill(0)
      .map((_, i) => i < this.soundManager.volume / 5);
  }

}
