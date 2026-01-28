import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { CartService } from '../../services/cart.service';
import { Training } from '../../models/training.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
})
export class TrainingsComponent implements OnInit {
  private trainingService = inject(TrainingService);
  private cartService = inject(CartService);
  toastService = inject(ToastService);

  allTrainings = signal<Training[]>([]);
  searchTerm = signal('');

  // State searchTerm() &  allTrainings().
  // Si searchTerm() || allTrainings() change=>recalcul.
  filteredTrainings = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const stock = this.allTrainings();

    return stock.filter((t) => t.name.toLowerCase().includes(search));
  });

  ngOnInit(): void {
    //Maj 'allTrainings'=>'computed' se réveille
    const data = this.trainingService.getTrainings();
    this.allTrainings.set(data);
  }

  addToCart(t: Training) {
    this.cartService.addToCart(t);
    this.toastService.show(t.name + ' ajouté au panier !', 'success');
  }
}
