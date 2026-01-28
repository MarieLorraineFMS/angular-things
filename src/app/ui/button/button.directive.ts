import { Directive, input, HostBinding } from '@angular/core';

@Directive({
  selector: 'button[uiButton]',
  standalone: true,
})
export class ButtonDirective {
  // On accepte les variantes BS : primary, danger, success, etc.
  variant = input<string>('primary');
  loading = input<boolean>(false);

  @HostBinding('class') get classes() {
    // Classes Bootstrap de base
    return `btn btn-${this.variant()}`;
  }

  @HostBinding('disabled') get isDisabled() {
    // Désactive le bouton nativement pendant le chargement
    return this.loading();
  }
}
