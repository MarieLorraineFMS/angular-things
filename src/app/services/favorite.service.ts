import { Injectable, signal, computed, effect, afterNextRender } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  // Ids favoris
  private favoriteIds = signal<number[]>([]);
  private isLoaded = false;

  // State compteur fav
  count = computed(() => this.favoriteIds().length);

  constructor() {
    // 1. set localstorage à chaque modif
    effect(() => {
      const currentFav = this.favoriteIds();
      // set si on a recup le browser &  loaded
      if (typeof window !== 'undefined' && this.isLoaded) {
        localStorage.setItem('mes_fav', JSON.stringify(currentFav));
      }
    });

    // 2. get localstorage au démarrage
    afterNextRender(() => {
      const saved = localStorage.getItem('mes_fav');
      if (saved) {
        // On remplit les favs
        this.favoriteIds.set(JSON.parse(saved));
      }
      // ready for next modifs
      this.isLoaded = true;
    });
  }

  // Check si id est fav
  isFavorite(id: number) {
    return this.favoriteIds().includes(id);
  }

  toggleFavorite(id: number) {
    this.favoriteIds.update(
      (ids) =>
        ids.includes(id)
          ? ids.filter((favId) => favId !== id) // remove existing
          : [...ids, id], // Add new
    );
  }
}
