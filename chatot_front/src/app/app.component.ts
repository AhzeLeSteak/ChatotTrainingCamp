import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HubService} from './hub.service';
import {FormsModule} from '@angular/forms';
import {SoundManagerService} from './sound-manager.service';
import {VolumeBinderDirective} from './volume-binder.directive';
import {LanguageService} from './language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, VolumeBinderDirective],
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


}
