import {ChangeDetectionStrategy, Component, computed, input, Input} from '@angular/core';

@Component({
  selector: 'app-type-img',
  standalone: true,
  imports: [],
  templateUrl: './type-img.component.html',
  styleUrl: './type-img.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeImgComponent {
  type = input.required<string>();
  url = computed(() => `/types/${this.type() ?? 'UNKNOWN'}.png`);
}
