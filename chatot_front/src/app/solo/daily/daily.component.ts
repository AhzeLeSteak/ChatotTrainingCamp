import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TimerTomorowComponent} from '../timer-tomorow/timer-tomorow.component';
import {DailyHintsComponent} from '../daily-hints/daily-hints.component';
import {SoundPlayerComponent} from '../../common/sound-player/sound-player.component';
import {SaveManagerService} from '../../../services/save-manager.service';
import {LanguageService} from '../../../services/language.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {DexIdService} from '../../../services/dex-id.service';

export enum SearchStatus {
  Searching,
  Found,
  Failed,
}

@Component({
    selector: 'app-daily',
    imports: [
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

  dexId = inject(DexIdService).dexId();

  input = signal('');
  showPropositions = signal(false);
  propositions = computed(() => this.languageManager.proposition_from_query(this.input()))

  readonly triesBeforeFail = 7;

  searchStatus = computed(() => {
    const tries = this.saveManager.tries();
    if(tries[tries.length - 1] === this.dexId) return SearchStatus.Found;
    if (tries.length < this.triesBeforeFail) return SearchStatus.Searching;
    return SearchStatus.Failed;
  });


  try() {
    const dexId = this.languageManager.id_from_name(this.input());
    if (dexId <= 0) return this.snackService.onNewMessage$.next('Pokémon not found');
    if(!dexId || this.saveManager.tries().includes(dexId)) return;

    this.saveManager.addTry(dexId);
    this.input.set('');
  }

  async share(withSpoilers: boolean) {
    if(!navigator.clipboard) return;

    const spoilers = withSpoilers ? '|| ' : '';
    const numero = 1 + this.saveManager.daysSinceEpoch - 20255 // 16/06/2025;
    const tries = this.saveManager.tries();
    const score = this.searchStatus() === SearchStatus.Failed ? '💀' : tries.length;

    let text = `Chatot #${numero} - ${score}/${this.triesBeforeFail}\n`;
    let i = 1;
    for(let pkId of tries) {
      text += `${i++}. ${spoilers}${this.languageManager.name_from_id(pkId)} ${spoilers}\n`
    }
    await navigator.clipboard.writeText(text)
    this.snackService.onNewMessage$.next('Copied to clipboard');
  }

}
