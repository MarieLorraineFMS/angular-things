import { Injectable, signal, computed, effect, afterNextRender } from '@angular/core';
import { Training } from '../models/training.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart = signal<Training[]>([]);
  isAnimate = signal(false);

  private isLoaded = false;

  // calcul qty
  cartCount = computed(() => this.cart().reduce((acc, item) => acc + (item.quantity || 1), 0));
  // calcul total avec qty
  totalAmount = computed(() =>
    this.cart().reduce((acc, item) => acc + item.price * (item.quantity || 1), 0),
  );
  constructor() {
    // 1. set localstorage à chaque modif
    effect(() => {
      const currentCart = this.cart();
      // set si on a recup le browser & loaded
      if (typeof window !== 'undefined' && this.isLoaded) {
        localStorage.setItem('mon_panier', JSON.stringify(currentCart));
      }
    });

    // 2. get localstorage au démarrage
    afterNextRender(() => {
      const saved = localStorage.getItem('mon_panier');
      if (saved) {
        // On remplit le panier avec les vieux trucs
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
    this.cart.update((items) => {
      const existingItem = items.find((item) => item.id === training.id);

      if (existingItem) {
        return items.map((item) =>
          item.id === training.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item,
        );
      } else {
        return [...items, { ...training, quantity: 1 }];
      }
    });

    this.isAnimate.set(true);
    setTimeout(() => this.isAnimate.set(false), 300);
  }

  updateQuantity(trainingId: number, change: number) {
    this.cart.update((items) => {
      return items.map((item) => {
        if (item.id === trainingId) {
          const newQty = (item.quantity || 1) + change;
          // check qty min 1
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      });
    });
  }

  removeFromCart(index: number) {
    this.cart.update((items) => items.filter((_, i) => i !== index));
  }

  clearCart() {
    this.cart.set([]);
  }
}
