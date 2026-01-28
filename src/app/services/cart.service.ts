import { Injectable, signal, computed, effect, afterNextRender } from '@angular/core';
import { Training } from '../models/training.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart = signal<Training[]>([]);
  isAnimate = signal(false);

  private isLoaded = false;

  cartCount = computed(() => this.cart().length);
  totalAmount = computed(() => this.cart().reduce((acc, item) => acc + item.price, 0));

  constructor() {
    // 1. set localstorage à chaque modif
    effect(() => {
      const currentCart = this.cart();
      // set si on a recup le browser &  loaded
      if (typeof window !== 'undefined' && this.isLoaded) {
        localStorage.setItem('mon_panier', JSON.stringify(currentCart));
      }
    });

    // 2. get localstorage au démarrage
    afterNextRender(() => {
      const saved = localStorage.getItem('mon_panier');
      if (saved) {
        // On remplit le panier avec les vieux souvenirs
        this.cart.set(JSON.parse(saved));
      }
      // ready for next modifs
      this.isLoaded = true;
    });
  }

  getCart() {
    return this.cart;
  }

  addToCart(training: Training) {
    this.cart.update((items) => [...items, training]);
    this.isAnimate.set(true);
    setTimeout(() => this.isAnimate.set(false), 300);
  }

  removeFromCart(index: number) {
    this.cart.update((items) => items.filter((_, i) => i !== index));
  }

  clearCart() {
    this.cart.set([]);
  }
}
