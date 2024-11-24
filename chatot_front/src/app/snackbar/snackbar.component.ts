import {Component, inject} from '@angular/core';
import {SnackbarService} from '../snackbar.service';
import {tap} from 'rxjs';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    NgIf
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent{

  snackService = inject(SnackbarService);

  showMsg = false;

  message$ = this.snackService.onNewMessage$.pipe(tap(() => {
    if(this.showMsg) return;
    this.showMsg = true;
    setTimeout(() => this.showMsg = false, 3000);
  }));

}
