import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Training } from '../../models/training.model';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { ApiService } from '../../services/api.service';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router); //  State page après la commande
  toastService = inject(ToastService);
  private api = inject(ApiService);

  // Check state via cartService
  items = this.cartService.getCart();

  showOrderForm = signal(false);
  searchTerm = signal('');

  private currentUser = this.authService.currentUser();

  // Infos client
  customer: Customer = {
    email: this.currentUser?.email || '',
    fullName: this.currentUser?.firstName + ' ' + this.currentUser?.lastName || '',
    address: '',
    phone: '',
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
    const customerName = this.customer.fullName;
    const order = {
      customer: this.customer,
      items: this.cartService.getCart()(),
      total: this.cartService.totalAmount(),
      date: new Date().toISOString(),
    };
    this.api.post('orders', order).subscribe(() => {
      this.toastService.show(
        `Merci ${this.customer.fullName} ! Commande n°${Math.floor(Math.random() * 1000)} enregistrée.`,
        'success',
      );

      this.cartService.clearCart();
      this.showOrderForm.set(false);

      setTimeout(() => {
        this.router.navigate(['/trainings']);
      }, 2000);
    });

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
