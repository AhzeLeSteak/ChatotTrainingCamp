import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-type-img',
  standalone: true,
  imports: [],
  templateUrl: './type-img.component.html',
  styleUrl: './type-img.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeImgComponent {

  @Input({required: true}) public type: string;

  get url(){
    return `/types/${this.type ?? 'UNKNOWN'}.png`
  }
}
