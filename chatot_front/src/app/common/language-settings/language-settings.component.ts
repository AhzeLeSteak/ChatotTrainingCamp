import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {LanguageService} from '../../../services/language.service';

@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrl: './language-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSettingsComponent {
  languageManager = inject(LanguageService);
}
