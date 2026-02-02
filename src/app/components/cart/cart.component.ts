import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Training } from '../../models/training.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  router = inject(Router); //  State page après la commande
  toastService = inject(ToastService);

  // Check state via cartService
  items = this.cartService.getCart();

  showOrderForm = signal(false);
  searchTerm = signal('');

  // Infos client
  customer = {
    name: '',
    email: '',
    address: '',
  };

  // Filtre panier
  filteredItems = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const items = this.cartService.getCart()();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search),
    );
  });

  displayForm() {
    this.showOrderForm.set(true);
  }

  onOrder() {
    const customerName = this.customer.name;

    // 1.ToastService
    this.toastService.show(`Merci ${customerName} ! Votre commande est validée.`, 'success');

    // 2. Clear panier & localStorage via service avec effect
    this.cartService.clearCart();

    // 3. Vanish form & redirect
    this.showOrderForm.set(false);

    // Racompagne le client à l'accueil
    setTimeout(() => {
      this.router.navigate(['/trainings']);
    }, 2000);
  }

  updateQty(item: Training, change: number) {
    this.cartService.updateQuantity(item.id, change);
  }
}
