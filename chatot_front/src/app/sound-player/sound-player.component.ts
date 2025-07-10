import {ChangeDetectionStrategy, Component, input, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VolumeBinderDirective} from '../volume-binder.directive';

@Component({
    selector: 'app-sound-player',
    imports: [CommonModule, VolumeBinderDirective],
    templateUrl: './sound-player.component.html',
    styleUrl: './sound-player.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundPlayerComponent {

  dexId = input.required<number>();
  soundPlaying = signal(false);

  play(audio: HTMLAudioElement, e: Event) {
    setTimeout(() => audio.play(), 2000);
  }

}
