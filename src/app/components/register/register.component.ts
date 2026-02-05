import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  registerForm = this.fb.group({
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    pseudo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        Validators.minLength(4),
        Validators.maxLength(30),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
    avatar: ['https://i.pravatar.cc/150'],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email;

      // 1. Check si email dispo
      this.authService.checkEmailExists(email!).subscribe((exists) => {
        if (exists) {
          // !dispo
          this.toast.message.set('Cet email est déjà utilisé !');
          this.toast.type.set('danger');
        } else {
          // 2. dispo
          const newUser = this.registerForm.value as any;
          this.authService.register(newUser).subscribe({
            next: () => {
              this.toast.message.set('Bienvenue ! Votre compte est créé.');
              this.toast.type.set('success');
              this.router.navigate(['/login']);
            },
          });
        }
      });
    }
  }
}
