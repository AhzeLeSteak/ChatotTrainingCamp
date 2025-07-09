import {Injectable, signal} from '@angular/core';

const key = 'VOLUME';

@Injectable({
  providedIn: 'root'
})
export class SoundManagerService {

  public volume = signal(parseInt(localStorage.getItem(key) ?? '50')); // [0; 100]

}
