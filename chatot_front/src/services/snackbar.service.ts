import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  public readonly onNewMessage$ = new BehaviorSubject<string>('');

}
