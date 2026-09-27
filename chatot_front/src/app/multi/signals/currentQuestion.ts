import {room} from './room';
import {computed} from '@angular/core';


export const currentQuestion = () => {
  const _room = room();
  return computed(() => _room().currentQuestion);
}
