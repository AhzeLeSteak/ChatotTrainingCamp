import {AfterViewInit, ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.scss'
})
export class DailyComponent implements AfterViewInit {
  protected readonly SearchStatus = SearchStatus;

  dexId = 0;

  input = '';
  showPropositions = false;

  readonly triesBeforeFail = 7;


  searchStatus = computed(() => {
    const tries = this.saveManager.tries$();
    if(tries[tries.length - 1] === this.dexId) return SearchStatus.Found;
    if (tries.length < this.triesBeforeFail) return SearchStatus.Searching;
    return SearchStatus.Failed;
  })


  saveManager = inject(SaveManagerService);
  languageManager = inject(LanguageService);
  snackService = inject(SnackbarService);
  rng = inject(RNGSeedService);


  async ngAfterViewInit() {
    this.saveManager.init()
    this.rng.seed(this.saveManager.daysSinceEpoch - 1);
    this.dexId = this.rng.nextRange(1, this.languageManager.LANGUAGE.length + 1);
  }

  try() {
    const dexId = this.languageManager.dexId(this.input);
    if (dexId <= 0) return this.snackService.onNewMessage$.next('Pokémon not found');
    if(!dexId || this.saveManager.tries$().includes(dexId)) return;

    this.saveManager.addTry(dexId);
    this.input = '';
  }

  async share(withSpoilers: boolean) {
    if(!navigator.clipboard) return;

    const spoilers = withSpoilers ? '|| ' : '';
    const numero = 1 + this.saveManager.daysSinceEpoch - 20255 // 16/06/2025;
    const tries = this.saveManager.tries$();
    const score = this.searchStatus() === SearchStatus.Failed ? '💀' : tries.length;

    let text = `Chatot #${numero} - ${score}/${this.triesBeforeFail}\n`;
    let i = 1;
    for(let pkId of tries) {
      text += `${i++}. ${spoilers}${this.languageManager.name(pkId)} ${spoilers}\n`
    }
    await navigator.clipboard.writeText(text)
    this.snackService.onNewMessage$.next('Copied to clipboard');
  }

}
