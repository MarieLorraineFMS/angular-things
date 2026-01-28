import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

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

  // Infos client
  customer = {
    name: '',
    email: '',
    address: '',
  };

  displayForm() {
    this.showOrderForm.set(true);
  }

  onOrder() {
    // FAlerte moche ça dégage !
    this.toastService.show('🚀 Commande validée ! Merci ' + this.customer.name, 'success');

    this.cartService.clearCart();
    this.router.navigateByUrl('/trainings');
  }
}
