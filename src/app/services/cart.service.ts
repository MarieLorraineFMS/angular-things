import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { Training } from '../models/training.model';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CartService {
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID); // Verif browser
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
    effect(() => {
      const user = this.auth.currentUser();
      const isBrowser = isPlatformBrowser(this.platformId);

      // Si un utilisateur se connecte
      if (isBrowser && user) {
        const saved = localStorage.getItem(`panier_user_${user.id}`);
        this.cart.set(saved ? JSON.parse(saved) : []);
        this.isLoaded = true;
      }
      // Si l'utilisateur se déco, on vide l'affichage du panier
      else if (isBrowser && !user) {
        this.cart.set([]);
        this.isLoaded = false;
      }
    });
    // set localstorage à chaque modif
    effect(() => {
      const currentCart = this.cart();
      const user = this.auth.currentUser();
      const isBrowser = isPlatformBrowser(this.platformId);
      if (isBrowser && this.isLoaded && user) {
        localStorage.setItem(`panier_user_${user.id}`, JSON.stringify(currentCart));
      }
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

  updateQuantity(trainingId: string, change: number) {
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
    const user = this.auth.currentUser();
    if (isPlatformBrowser(this.platformId) && user) {
      localStorage.removeItem(`panier_user_${user.id}`);
    }
  }
}
