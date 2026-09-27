import {Service, signal} from '@angular/core';

const key = 'VOLUME';

@Service()
export class SoundManagerService {

  public volume = signal(parseInt(localStorage.getItem(key) ?? '50')); // [0; 100]

}
