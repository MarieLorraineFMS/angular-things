import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User, USER_ROLES } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSession();
    }
  }

  /////////// ENCRYPT/DECRYPT ///////////////////

  private hashText(text: string): string {
    return btoa(text);
  }

  private encrypt(data: any): string {
    return btoa(JSON.stringify(data));
  }

  private decrypt(data: string): any {
    return JSON.parse(atob(data));
  }

  ///////////// LOGIN / LOGOUT / SESSION /REGISTER ///////////////

  login(email: string, password: string): Observable<boolean> {
    return this.api.get<User[]>('users').pipe(
      map((users) => {
        const user = users.find((u) => u.email === email);
        if (user) {
          localStorage.setItem('user_session', this.encrypt(user));
          if (user.password === this.hashText(password)) {
            localStorage.setItem('user_session', this.encrypt(user));
            this.currentUser.set(user);
            return true;
          }
        }
        return false;
      }),
    );
  }

  logout() {
    localStorage.removeItem('user_session');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private loadSession() {
    const saved = localStorage.getItem('user_session');
    if (saved) {
      try {
        this.currentUser.set(this.decrypt(saved));
      } catch (e) {
        this.logout();
      }
    }
  }

  isAdmin(): boolean {
    return this.currentUser()?.userRoles?.includes(USER_ROLES.ADMIN) || false;
  }

  // Vérif unicité email
  checkEmailExists(email: string): Observable<boolean> {
    return this.api.get<User[]>('users').pipe(map((users) => users.some((u) => u.email === email)));
  }

  register(newUser: User): Observable<User> {
    const userToSave = {
      ...newUser,
      password: this.hashText(newUser.password),
      userRoles: ['USER'],
    };
    return this.api.post<User>('users', userToSave);
  }
}
