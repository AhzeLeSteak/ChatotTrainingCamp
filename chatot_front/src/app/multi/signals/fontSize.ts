import {computed, inject} from '@angular/core';
import {LanguageService} from '../../../services/language.service';


export const fontSize = () => {
  const languageManager = inject(LanguageService);
  return computed(() =>
    'ko' === languageManager.selected_language()
      ? '.8em'
      : '1.2em');
};
