import {HubService} from '../../../services/hub.service';
import {inject} from '@angular/core';

export const room = () => inject(HubService).room
