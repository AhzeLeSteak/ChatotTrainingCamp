import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TimerTomorowComponent} from '../timer-tomorow/timer-tomorow.component';
import {DailyHintsComponent} from '../daily-hints/daily-hints.component';
import {SoundPlayerComponent} from '../../common/sound-player/sound-player.component';
import {SaveManagerService} from '../../../services/save-manager.service';
import {LanguageService} from '../../../services/language.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {CommonModule} from '@angular/common';

const MIN = 20293; // 24/07/2025

export enum SearchStatus {
  Searching,
  Found,
  Failed,
}

@Component({
    selector: 'app-daily',
    imports: [
      CommonModule,
        SoundPlayerComponent,
        ReactiveFormsModule,
        FormsModule,
        TimerTomorowComponent,
        DailyHintsComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './daily.component.html',
    styleUrl: './daily.component.scss'
})
export class DailyComponent {
  protected readonly SearchStatus = SearchStatus;

  saveManager = inject(SaveManagerService);
  languageManager = inject(LanguageService);
  snackService = inject(SnackbarService);

  dexId = inject(SaveManagerService).dexId;

  input = signal('');
  showPropositions = signal(false);
  propositions = computed(() => this.languageManager.proposition_from_query(this.input()))

  readonly triesBeforeFail = 6;

  selectedDate = this.saveManager.selectedDate;
  tries = this.saveManager.tries;

  searchStatus = computed(() => {
    const tries = this.tries();
    if(tries[tries.length - 1] === this.dexId()) return SearchStatus.Found;
    if (tries.length < this.triesBeforeFail) return SearchStatus.Searching;
    return SearchStatus.Failed;
  });

  formatedDate = computed(() => {
    const epoch = new Date('01/01/1970');
    epoch.setDate(epoch.getDate() + this.selectedDate());
    return epoch.toLocaleDateString();
  })


  try() {
    const dexId = this.languageManager.id_from_name(this.input());
    if (dexId <= 0) return this.snackService.onNewMessage$.next('Pokémon not found');
    if(!dexId || this.tries().includes(dexId)) return;

    this.saveManager.addTry(dexId);
    this.input.set('');
  }

  canGoPrev = computed(() => this.selectedDate() > MIN);
  previousDay = () => this.selectedDate.update(x => x-1);
  canGoNext = computed(() => this.selectedDate() < this.saveManager.daysSinceEpoch);
  nextDay = () => this.selectedDate.update(x => x+1);

  async share(withSpoilers: boolean) {
    if(!navigator.clipboard) return;

    const spoilers = withSpoilers ? '|| ' : '';
    const numero = 1 + this.saveManager.daysSinceEpoch - 20255 // 16/06/2025;
    const tries = this.saveManager.tries();
    const score = this.searchStatus() === SearchStatus.Failed ? '💀' : tries.length;

    let text = `Chatot #${numero} - ${score}/${this.triesBeforeFail}\n`;

    let i = 1;
    for(let pkId of tries) {
      const lastAndFound = i === tries.length && this.searchStatus() === SearchStatus.Found;
      const s = lastAndFound ? '' : spoilers;
      text += `${i++}. ${s}${lastAndFound ? '✅✅✅✅✅' : this.languageManager.name_from_id(pkId)} ${s}\n`
    }
    text += `\n${window.location.href}`
    await navigator.clipboard.writeText(text)
    this.snackService.onNewMessage$.next('Copied to clipboard');
  }

}
