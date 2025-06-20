import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
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
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarComponent{

  snackService = inject(SnackbarService);

  showMsg = signal(false);

  timeout: any;

  message$ = this.snackService.onNewMessage$.pipe(tap(() => {
    clearTimeout(this.timeout);
    this.showMsg.set(true)
    this.timeout = setTimeout(() => this.showMsg.set(false), 3000);
  }));

}
