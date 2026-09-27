import {Service} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Service()
export class SnackbarService {

  public readonly onNewMessage$ = new BehaviorSubject<string>('');

}
