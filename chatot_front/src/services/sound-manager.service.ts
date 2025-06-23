import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

const key = 'VOLUME';

@Injectable({
  providedIn: 'root'
})
export class SoundManagerService {

  private _volume = parseInt(localStorage.getItem(key) ?? '50'); // [0; 100]
  public readonly onVolumeChange = new BehaviorSubject(this._volume);

  get volume() {
    return this._volume;
  }

  set volume(volume: number) {
    this._volume = volume;
    this.onVolumeChange.next(volume);
    localStorage.setItem(key, volume.toString());
  }



}
