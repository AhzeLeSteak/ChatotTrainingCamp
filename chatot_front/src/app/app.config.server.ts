import {mergeApplicationConfig, ApplicationConfig, provideZonelessChangeDetection} from '@angular/core';
import { appConfig } from './app.config';
import {provideHttpClient} from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
