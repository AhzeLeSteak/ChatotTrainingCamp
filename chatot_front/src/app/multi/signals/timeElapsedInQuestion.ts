import {toSignal} from '@angular/core/rxjs-interop';
import {map, timer} from 'rxjs';
import {room} from './room';
import {computed} from '@angular/core';


export const timeElapsedInQuestion = () => {
  const _timer = toSignal(
    timer(0, 100).pipe(map(() => new Date())),
    {initialValue: new Date()}
  );
  const _room = room();
  return computed(() => Math.max(0, _timer().getTime() - _room().currentQuestion.startDate.getTime()));
}
