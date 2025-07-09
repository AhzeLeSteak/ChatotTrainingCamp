import {Directive, effect, ElementRef} from '@angular/core';
import {SoundManagerService} from '../services/sound-manager.service';

@Directive({
  selector: '[appVolumeBinder]',
  standalone: true
})
export class VolumeBinderDirective {

  constructor(volumeService: SoundManagerService, elementRef: ElementRef) {
    const audio = elementRef.nativeElement as HTMLAudioElement;
    effect(() => {
      audio.volume = volumeService.volume() / 100;
    });
  }

}
