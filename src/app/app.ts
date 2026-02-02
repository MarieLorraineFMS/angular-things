import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { ToastService } from './services/toast.service';
import { FavoriteService } from './services/favorite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  cartService = inject(CartService);
  toastService = inject(ToastService);
  favoriteService = inject(FavoriteService);
}
