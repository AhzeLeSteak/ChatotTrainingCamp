import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, input, Input, model, output, Output} from '@angular/core';

@Component({
  selector: 'app-select-button',
  imports: [CommonModule],
  templateUrl: './select-button.component.html',
  styleUrl: './select-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectButtonComponent<T> {


  disabled = input(false);
  options = input.required<any[]>();
  multiple = input(false);
  ngModel = input<any>();
  ngModelChange = output<any>();

  optionLabel = input<string>();
  optionValue = input<string>();
  grid = input(false);

  isOptionSelected(option: any): boolean {
    const value = this.optionValue() ? option[this.optionValue()!] : option;
    return this.multiple()
      ? (this.ngModel() as any[]).includes(value)
      : this.ngModel() === value;
  }

  click(option: any) {
    if (this.disabled()) return;
    const value = this.optionValue() ? option[this.optionValue()!] : option;
    if (this.multiple()) {
      let array = this.ngModel() as any[];
      if (array.includes(value))
        array = array.filter(el => el !== value);
      else
        array.push(value)
      this.ngModelChange.emit(array);
    } else
      this.ngModelChange.emit(value);
  }

}
