import {ChangeDetectionStrategy, Component, computed, input, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VolumeBinderDirective} from '../../volume-binder.directive';

@Component({
    selector: 'app-sound-player',
    imports: [CommonModule, VolumeBinderDirective],
    templateUrl: './sound-player.component.html',
    styleUrl: './sound-player.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundPlayerComponent {

  dexId = input.required<number>();
  audioSrc = computed(() => `/sounds/${this.dexId().toString().padStart(4, '0')}.ogg`);

  soundPlaying = signal(false);

}
