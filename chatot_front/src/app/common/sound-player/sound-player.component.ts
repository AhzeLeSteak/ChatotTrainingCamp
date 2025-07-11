import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChild
} from '@angular/core';
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

  //  I/O
  dexId = input.required<number>();
  disabled = input(false);

  //  View
  audio = viewChild<ElementRef<HTMLAudioElement>>('audio');

  //  States
  soundPlaying = signal(false);
  audioSrc = computed(() => `/sounds/${this.dexId().toString().padStart(4, '0')}.ogg`);
  hide = signal(false);

  _ = effect(() => {
    this.dexId();
    this.hide.set(true);
    setTimeout(() => this.hide.set(false), 1);
  })

  public play(){
    this.audio()?.nativeElement?.play();
  }

}
