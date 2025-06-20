import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {VolumeBinderDirective} from "../volume-binder.directive";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sound-player',
  standalone: true,
    imports: [CommonModule, VolumeBinderDirective],
  templateUrl: './sound-player.component.html',
  styleUrl: './sound-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundPlayerComponent {

  @Input({required: true}) dexId!: number;

  soundPlaying = signal(false);

  play(audio: HTMLAudioElement, e: Event) {
    console.log(audio, e);
    setTimeout(() => audio.play(), 2000);
  }
}
