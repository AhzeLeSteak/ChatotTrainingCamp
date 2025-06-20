import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {HubService} from './hub.service';
import {FormsModule} from '@angular/forms';
import {SoundManagerService} from './sound-manager.service';
import {VolumeBinderDirective} from './volume-binder.directive';
import {LanguageService} from './language.service';
import {map} from 'rxjs';
import {SnackbarComponent} from './snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, VolumeBinderDirective, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{


  hub = inject(HubService);
  router = inject(Router);
  soundManager = inject(SoundManagerService);
  languageManager = inject(LanguageService);

  loading = signal(true);


  async ngOnInit() {
    await this.hub.createConnection();
    const rejoined = await this.hub.tryRejoin();
    if(rejoined){
      console.log('Rejoined room');
      await this.router.navigate(['play']);
    }
    else if(this.router.url === '/play'){
      await this.router.navigate(['']);
    }
    this.loading.set(false);
  }

  async home(){
    if(this.hub.inRoom && confirm("Leave room ?"))
      await this.hub.quitRoom();
    this.router.navigate(['']);
  }

  get soundBar$(){
    return this.soundManager.onVolumeChange.pipe(map(volume =>
      new Array(20)
        .fill(0)
        .map((_, i) => i < volume / 5)
    ));
  }

}
