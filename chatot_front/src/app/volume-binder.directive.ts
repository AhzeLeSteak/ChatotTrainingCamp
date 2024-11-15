import {Directive, ElementRef, inject} from '@angular/core';
import {SoundManagerService} from './sound-manager.service';

@Directive({
  selector: '[appVolumeBinder]',
  standalone: true
})
export class VolumeBinderDirective {

  constructor(volumeService: SoundManagerService, elementRef: ElementRef) {
    const audio = elementRef.nativeElement as HTMLAudioElement;
    audio.volume = volumeService.volume / 100;
    volumeService.onVolumeChange.subscribe(volume => {
      console.log(volume, audio);
      audio.volume = volume / 100;
    });
  }

}
