import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  /////////////// INPUTS
  @Input() type: 'text' | 'number' | 'email' | 'password' = 'text';
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;

  /////////////// VALUE (controlled state)
  value: string | number = '';

  /////////////// OUTPUTS (callbacks)
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  // Angular → register change handler
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Angular → register touched handler
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Angular → disabled state
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // DOM → user types
  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.type === 'number' ? Number(input.value) : input.value;

    this.value = value;
    this.onChange(value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
