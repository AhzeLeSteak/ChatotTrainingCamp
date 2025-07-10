import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HubService} from '../services/hub.service';
import {LanguageService} from '../services/language.service';
import {SoundManagerService} from '../services/sound-manager.service';
import {DexIdService} from '../services/dex-id.service';
import {SnackbarComponent} from './common/snackbar/snackbar.component';
import {LanguageSettingsComponent} from './common/language-settings/language-settings.component';
import {SoundSettingsComponent} from './common/sound-settings/sound-settings.component';

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, SnackbarComponent, LanguageSettingsComponent, SoundSettingsComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DexIdService, LanguageService, SoundManagerService]
})
export class AppComponent implements OnInit{


  hub = inject(HubService);
  router = inject(Router);

  loading = signal(true);


  async ngOnInit() {
    try{
      await this.hub.createConnection();
      const rejoined = await this.hub.tryRejoin();
      if(rejoined){
        console.log('Rejoined room');
        await this.router.navigate(['play']);
      }
      else if(this.router.url === '/play'){
        await this.router.navigate(['']);
      }
    }
    finally {
      this.loading.set(false);
    }
  }

  async home(){
    if(this.hub.inRoom && confirm("Leave room ?"))
      await this.hub.quitRoom();
    this.router.navigate(['']);
  }

}
