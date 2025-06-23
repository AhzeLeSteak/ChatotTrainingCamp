import {Injectable, signal} from '@angular/core';

const DAYS_SINCE_EPOCH = 'DAYS_SINCE_EPOCH';
const TRIES = 'TRIES';

@Injectable({
  providedIn: 'root'
})
export class SaveManagerService {

  public tries$ = signal<number[]>([]);

  addTry(dexId: number) {
    this.tries$.update(t => [...t, dexId]);
    localStorage.setItem(DAYS_SINCE_EPOCH, this.daysSinceEpoch.toString());
    localStorage.setItem(TRIES, JSON.stringify(this.tries$()));
  }

  init() : void {
      let tries: number[] = [];
      const daysSinceEpoch = this.daysSinceEpoch;
      if(+(localStorage.getItem(DAYS_SINCE_EPOCH) ?? 0) === daysSinceEpoch){
        const savedTries = JSON.parse(localStorage.getItem(TRIES) ?? '[]');
        if(Array.isArray(savedTries) && savedTries.every(el => typeof el === 'number')){
          tries = savedTries;
        }
      }
      this.tries$.set(tries);
  }

  get daysSinceEpoch(){
    let now = new Date().getTime();
    now -= new Date().getTimezoneOffset() * 60 * 1000;
    return Math.floor(now/8.64e7);
  }
}
