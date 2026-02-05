import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMsg = signal('');

  /////// FORM ////////

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        // Verif texte@texte.domaine
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/trainings']);
          } else {
            this.errorMsg.set('Identifiants incorrects.');
          }
        },
        error: (err) => {
          this.errorMsg.set('Erreur de connexion au serveur : ' + err.message);
        },
      });
    }
  }
}
