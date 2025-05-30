import {AfterViewInit, Component, inject} from '@angular/core';
import {SoundPlayerComponent} from '../sound-player/sound-player.component';
import {LanguageService} from '../language.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SnackbarService} from '../snackbar.service';
import {RNGSeedService} from '../rngseed.service';
import {SaveManagerService} from '../save-manager.service';
import {TimerTomorowComponent} from '../timer-tomorow/timer-tomorow.component';
import {DailyHintsComponent} from '../daily-hints/daily-hints.component';



export enum SearchStatus {
  Searching,
  Found,
  Failed,
}

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [
    SoundPlayerComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TimerTomorowComponent,
    DailyHintsComponent,
  ],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.scss'
})
export class DailyComponent implements AfterViewInit {
  protected readonly SearchStatus = SearchStatus;

  dexId = 0;

  input = '';
  showPropositions = false;


  saveManager = inject(SaveManagerService);
  languageManager = inject(LanguageService);
  snackService = inject(SnackbarService);
  rng = inject(RNGSeedService);


  async ngAfterViewInit() {
    this.rng.seed(this.saveManager.daysSinceEpoch - 1);
    this.dexId = this.rng.nextRange(1, this.languageManager.LANGUAGE.length + 1);
  }


  try() {
    const dexId = this.languageManager.dexId(this.input);
    if (dexId <= 0) return this.snackService.onNewMessage$.next('Pokémon not found');
    if(!dexId || this.tries.includes(dexId)) return;

    this.saveManager.addTry(dexId);
    this.input = '';
  }


  get searchStatus(): SearchStatus {
    if(this.tries[this.tries.length - 1] === this.dexId) return SearchStatus.Found;
    if (this.tries.length < 7) return SearchStatus.Searching;
    return SearchStatus.Failed;
  }

  get tries() {
    return this.saveManager.tries;
  }


}
