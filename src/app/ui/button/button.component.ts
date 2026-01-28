import { Component, EventEmitter, Input, Output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  ///////// Inputs ///////
  @Input() label = ''; // text label
  @Input() variant: ButtonVariant = 'primary'; // style
  @Input() type: 'button' | 'submit' | 'reset' = 'button'; // type
  @Input() disabled = false; // Disable interactions
  @Input() loading = false; // Show a loading state & block clicks
  @Input() ariaLabel?: string; // Accessibility label
  @Input() className = '';

  ///////// Outputs ///////
  @Output() pressed = new EventEmitter<MouseEvent>(); // click

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  get buttonClasses(): string {
    const base = 'btn ui-btn';
    const variantClass =
      this.variant === 'primary'
        ? 'btn-primary'
        : this.variant === 'secondary'
          ? 'btn-secondary'
          : this.variant === 'tertiary'
            ? 'btn-outline-secondary'
            : 'btn-danger';

    return [base, variantClass, this.className].filter(Boolean).join(' ');
  }

  onClick(event: MouseEvent): void {
    if (this.isDisabled) return;
    this.pressed.emit(event);
  }
}
