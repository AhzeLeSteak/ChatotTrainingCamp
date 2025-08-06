import {computed, effect, Injectable, linkedSignal, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveManagerService {

  public selectedDate = signal(this.daysSinceEpoch);
  private storageKey = computed(() => `TRIES_${this.selectedDate()}`);
  public dexId = computed(() => this.nextRange(this.selectedDate(), 1, 1025 + 1));

  private tries$ = linkedSignal({
    source: () => this.selectedDate(),
    computation: () => this.tries_from_storage()
  });
  public tries = this.tries$.asReadonly();

  private streak = localStorageSignalNumberArray('STREAK', []);

  public streakLength = computed(() => {
    const streak = this.streak();
    const today = this.daysSinceEpoch;
    let i = streak.length - 1;
    let streak_count = 0;
    while(i >= 0 && streak[i] === today + i - streak.length + 1){
      streak_count++
      i--;
    }

    return streak_count;
  });

  constructor() {
    console.log({dayIndex: this.daysSinceEpoch});
  }


  addTry(dexId: number) {
    this.tries$.update(t => [...t, dexId]);
    localStorage.setItem(this.storageKey(), JSON.stringify(this.tries()));
    if(this.selectedDate() === this.daysSinceEpoch && dexId === this.dexId())
      this.streak.update(s => [...s, this.daysSinceEpoch]);
  }

  private tries_from_storage(): number[] {
    const fromStorage = localStorage.getItem(this.storageKey());
    if (!fromStorage) return [];

    try {
      const parsed = JSON.parse(fromStorage);
      if (Array.isArray(parsed) && parsed.every(el => typeof el === 'number')) {
        return parsed;
      }
    } catch (ex) {
    }
    return []
  }

  get daysSinceEpoch() {
    let now = new Date().getTime();
    now -= new Date().getTimezoneOffset() * 60 * 1000;
    return Math.floor(now / 8.64e7);
  }

  nextRange(seed: number, start: number, end: number) {
    const rangeSize = end - start;
    let t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    const random0to1 = ((t ^ t >>> 14) >>> 0) / 4294967296;
    return start + Math.floor(random0to1 * rangeSize);
  }

}

function localStorageSignalNumberArray(key: string, base_value: number[]){
  return localStorageSignal(key, base_value, x => Array.isArray(x) && x.every(el => typeof el === 'number'));
}

function localStorageSignal<T>(key: string, base_value: T, verif ?: (x: unknown) => x is T){

  const s = signal(base_value);

  const stored = localStorage.getItem(key);
  if(stored){
    try{
      const parsed = JSON.parse(stored);
      if(verif){
        if(verif(parsed))
          s.set(parsed);
      }
      else
        s.set(parsed);
    }
    catch (e){}
  }

  effect(() => {
    localStorage.setItem(key, JSON.stringify(s()));
  });
  return s;
}
