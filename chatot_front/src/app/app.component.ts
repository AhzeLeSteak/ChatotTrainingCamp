import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HubService } from './hub.service';
import { GuessCardComponent } from "./guess-card/guess-card.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, GuessCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{


  hub = inject(HubService);
  router = inject(Router);

  async ngOnInit() {
    await this.hub.createConnection();
    const rejoined = await this.hub.tryRejoin();
    if(rejoined)
      this.router.navigate(['play']);
  }
  

}
