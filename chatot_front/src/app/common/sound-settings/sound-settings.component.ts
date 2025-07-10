import {Component, computed, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {VolumeBinderDirective} from '../../volume-binder.directive';
import {SoundManagerService} from '../../../services/sound-manager.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sound-settings',
  imports: [
    ReactiveFormsModule,
    VolumeBinderDirective,
    CommonModule,
    FormsModule
  ],
  templateUrl: './sound-settings.component.html',
  styleUrl: './sound-settings.component.scss'
})
export class SoundSettingsComponent {

  soundManager = inject(SoundManagerService);

  soundBar = computed(() => new Array(20)
    .fill(0)
    .map((_, i) => i < this.soundManager.volume() / 5)
  );

}
