import { Injectable } from '@angular/core';

const DAYS_SINCE_EPOCH = 'DAYS_SINCE_EPOCH';
const TRIES = 'TRIES';

@Injectable({
  providedIn: 'root'
})
export class SaveManagerService {

  private _tries: number[];

  addTry(dexId: number) {
    this._tries.push(dexId);
    localStorage.setItem(DAYS_SINCE_EPOCH, this.daysSinceEpoch.toString());
    localStorage.setItem(TRIES, JSON.stringify(this._tries));
  }

  get tries() : readonly number[] {
    if(!this._tries){
      this._tries = [];
      const daysSinceEpoch = this.daysSinceEpoch;
      if(+(localStorage.getItem(DAYS_SINCE_EPOCH) ?? 0) === daysSinceEpoch){
        const savedTries = JSON.parse(localStorage.getItem(TRIES) ?? '[]');
        if(Array.isArray(savedTries) && savedTries.every(el => typeof el === 'number')){
          this._tries = savedTries;
        }
      }
    }
    return this._tries;
  }

  get daysSinceEpoch(){
    let now = new Date().getTime();
    now -= new Date().getTimezoneOffset() * 60 * 1000;
    return Math.floor(now/8.64e7);
  }
}
