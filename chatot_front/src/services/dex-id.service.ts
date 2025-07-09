import {Injectable, signal} from '@angular/core';
import {SaveManagerService} from './save-manager.service';

@Injectable({
  providedIn: 'platform'
})
export class DexIdService {

  public dexId = signal(-1);

  // LCG using GCC's constants
  private m = 0x80000000; // 2**31;
  private a = 1103515245;
  private c = 12345;
  private state: number = 0;

  constructor(sm: SaveManagerService) {
    this.seed(sm.daysSinceEpoch);
    this.dexId.set(this.nextRange(1, 1025 + 1));
  }


  private seed(seed: number) {
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
  }

  private nextInt() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }

  nextRange(start: number, end: number) {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    var rangeSize = end - start;
    var randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
}
