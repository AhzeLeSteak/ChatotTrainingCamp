import { Component, Input } from '@angular/core';
import {VolumeBinderDirective} from "../volume-binder.directive";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sound-player',
  standalone: true,
    imports: [CommonModule, VolumeBinderDirective],
  templateUrl: './sound-player.component.html',
  styleUrl: './sound-player.component.scss'
})
export class SoundPlayerComponent {

  @Input({required: true}) dexId!: number;
  @Input({required: false}) autoplay = false;

  soundPlaying = false;

}
