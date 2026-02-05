import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  // Ids favoris
  private favoriteIds = signal<string[]>([]);
  private isLoaded = false;
  isAnimate = signal(false);

  // State compteur fav
  count = computed(() => this.favoriteIds().length);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const isBrowser = isPlatformBrowser(this.platformId);

      if (isBrowser && user) {
        const saved = localStorage.getItem(`fav_user_${user.id}`);
        this.favoriteIds.set(saved ? JSON.parse(saved) : []);
        this.isLoaded = true;
      } else if (isBrowser && !user) {
        // !co, on cache les favoris
        this.favoriteIds.set([]);
        this.isLoaded = false;
      }
    });
    // set localstorage à chaque modif
    effect(() => {
      const currentFav = this.favoriteIds();
      const user = this.auth.currentUser();
      const isBrowser = isPlatformBrowser(this.platformId);

      if (isBrowser && this.isLoaded && user) {
        localStorage.setItem(`fav_user_${user.id}`, JSON.stringify(currentFav));
      }
    });
  }

  // Check si id est fav
  isFavorite(id: string) {
    return this.favoriteIds().includes(id);
  }

  toggleFavorite(id: string) {
    if (!this.auth.currentUser()) return;
    this.favoriteIds.update(
      (ids) =>
        ids.includes(id)
          ? ids.filter((favId) => favId !== id) // remove existing
          : [...ids, id], // Add new
    );
    this.isAnimate.set(true);
    setTimeout(() => this.isAnimate.set(false), 300);
  }
}
