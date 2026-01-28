import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Appel du service du panier pour qu'il surveille le compteur
  // accessible partout dans le HTML via "cartService"
  cartService = inject(CartService);
  toastService = inject(ToastService);
}
