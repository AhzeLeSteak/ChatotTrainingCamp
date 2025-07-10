import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-select-button',
    imports: [CommonModule],
    templateUrl: './select-button.component.html',
    styleUrl: './select-button.component.scss'
})
export class SelectButtonComponent {


  @Input() disabled: boolean = false;
  @Input({required: true}) options: any[] = [];
  @Input({required: true}) ngModel: any;
  @Input() multiple = false;
  @Input() optionLabel?: string;
  @Input() optionValue?: string;
  @Input() grid = false;

  @Output() ngModelChange = new EventEmitter<any>();

  optionSelected(option: any): boolean {
    const value = this.optionValue ? option[this.optionValue] : option;
    return this.multiple
      ? (this.ngModel as any[]).includes(value)
      : this.ngModel === value;
  }

  click(option: any){
    if(this.disabled) return;
    const value = this.optionValue ? option[this.optionValue] : option;
    if(this.multiple){
      let array = this.ngModel as any[];
      if(array.includes(value))
        array = array.filter(el => el !== value);
      else
        array.push(value)
      if(array.length)
        this.ngModelChange.emit(array);
    }
    else
      this.ngModelChange.emit(value);
  }

}
