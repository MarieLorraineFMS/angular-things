import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { CartService } from '../../services/cart.service';
import { Training } from '../../models/training.model';
import { ToastService } from '../../services/toast.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
})
export class TrainingsComponent implements OnInit {
  public authService = inject(AuthService);
  private trainingService = inject(TrainingService);
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);
  public catService = inject(CategoryService);

  toastService = inject(ToastService);

  allTrainings = signal<Training[]>([]);
  searchTerm = signal('');
  selectedCategory = signal('Toutes');
  maxPrice = signal(3000);

  // Category fabric
  categories = computed(() => {
    const cats = this.allTrainings().map((t) => t.category);
    return ['Toutes', ...new Set(cats)];
  });

  highestPrice = computed(() => {
    const prices = this.allTrainings().map((t) => t.price);
    return prices.length > 0 ? Math.max(...prices) : 3000;
  });
  lowestPrice = computed(() => {
    const prices = this.allTrainings().map((t) => t.price);
    return prices.length > 0 ? Math.min(...prices) : 0;
  });

  // State searchTerm() &  allTrainings().
  // Si searchTerm() || allTrainings()|| category changent=>recalcul.
  filteredTrainings = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const cat = this.selectedCategory();
    const limit = this.maxPrice();

    return this.allTrainings().filter((t) => {
      const nameMatch = t.name.toLowerCase().includes(search);
      const descMatch = t.description.toLowerCase().includes(search);
      const catMatch = cat === 'Toutes' || t.category === cat;
      const priceMatch = t.price <= limit;

      return (nameMatch || descMatch) && catMatch && priceMatch;
    });
  });

  ngOnInit(): void {
    // s'abonner au flux de données du service
    this.trainingService.getTrainings().subscribe((data) => {
      // 1. state allTrainings
      this.allTrainings.set(data);

      // 2. calcul maxPrice
      if (data.length > 0) {
        const max = Math.max(...data.map((t) => t.price));
        this.maxPrice.set(max);
      }
    });
  }

  addToCart(t: Training) {
    this.cartService.addToCart(t);
    this.toastService.show(t.name + ' ajouté au panier !', 'success');
  }

  toggleFavorite(t: Training) {
    this.favoriteService.toggleFavorite(t.id);
    const isFav = this.favoriteService.isFavorite(t.id);
    this.toastService.show(
      t.name + (isFav ? ' ajouté aux favoris !' : ' retiré des favoris !'),
      'success',
    );
  }
  isFavorite(t: Training) {
    return this.favoriteService.isFavorite(t.id);
  }
}
