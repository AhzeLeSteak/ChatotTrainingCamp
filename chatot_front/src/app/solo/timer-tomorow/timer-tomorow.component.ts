import {ChangeDetectionStrategy, Component} from '@angular/core';
import {interval, map, timer} from 'rxjs';
import {AsyncPipe} from '@angular/common';

const z = (n: number) => `${n < 10 ? '0' : ''}${n}`;

const nextMidnight = new Date();
nextMidnight.setHours(24, 0,0,0);

@Component({
    selector: 'app-timer-tomorow',
    imports: [
        AsyncPipe
    ],
    templateUrl: './timer-tomorow.component.html',
    styleUrl: './timer-tomorow.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerTomorowComponent {

  timeUntilTomorow = timer(0, 500)
    .pipe(map(() => {
      const {hours, minutes, seconds} = this.getTimeRemaining(nextMidnight)
      return `${z(hours)}:${z(minutes)}:${z(seconds)}`;
    }))

  getTimeRemaining(endtime: Date){
    const diff = endtime.getTime() - new Date().getTime();
    const hours = diff/3.6e6 | 0;
    const minutes  = diff%3.6e6 / 6e4 | 0;
    const seconds  = Math.round(diff%6e4 / 1e3)
    return {
      seconds,
      minutes,
      hours,
    }
  }

}
