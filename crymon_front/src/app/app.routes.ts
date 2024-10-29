import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';

export const routes: Routes = [
    {
        path: 'join/:code',
        component: HomeComponent
    },
    {
        path: 'play',
        component: RoomComponent
    },
    {
        path: '',
        component: HomeComponent
    }
];
