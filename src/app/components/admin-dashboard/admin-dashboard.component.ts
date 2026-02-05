import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Training } from '../../models/training.model';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  public catService = inject(CategoryService);

  trainings = signal<Training[]>([]);
  newCatName = signal('');

  isEditing = signal(false);

  currentTraining: Partial<Training> = {
    name: '',
    description: '',
    price: 0,
    category: 'Inclassable', // On utilise la valeur par défaut
    icon: 'bi-code-slash',
  };

  constructor() {
    this.loadTrainings();
  }

  loadTrainings() {
    this.api.get<Training[]>('trainings').subscribe((data) => this.trainings.set(data));
  }

  saveTraining() {
    if (this.isEditing()) {
      this.api
        .put<Training>(`trainings/${this.currentTraining.id}`, this.currentTraining)
        .subscribe(() => {
          this.toast.show('Formation mise à jour !', 'success');
          this.finishAction();
        });
    } else {
      this.api.post<Training>('trainings', this.currentTraining).subscribe(() => {
        this.toast.show('Formation créée !', 'success');
        this.finishAction();
      });
    }
  }

  editTraining(training: Training) {
    this.isEditing.set(true);
    this.currentTraining = { ...training };
    window.scrollTo(0, 0);
  }

  deleteTraining(id: string) {
    if (confirm('Supprimer cette formation ?')) {
      this.api.delete(`trainings/${id}`).subscribe(() => {
        this.toast.show('Formation supprimée', 'danger');
        this.loadTrainings();
      });
    }
  }

  addNewCategory() {
    if (this.newCatName()) {
      this.catService.addCategory(this.newCatName());
      this.toast.show(`Catégorie "${this.newCatName()}" ajoutée !`, 'success');
      this.newCatName.set('');
    }
  }

  renameCat(cat: Category) {
    if (cat.name === 'Inclassable') {
      this.toast.show('Impossible de modifier la catégorie par défaut.', 'warning');
      return;
    }

    const newName = prompt(`Renommer "${cat.name}" en :`, cat.name);

    // On vérifie si le nouveau nom n'est pas vide et !== du précédent
    if (newName && newName.trim() !== cat.name) {
      this.catService.renameCategory(cat, newName.trim());
      this.toast.show('Catégorie & formations mises à jour !', 'success');

      setTimeout(() => this.loadTrainings(), 600);
    }
  }

  deleteCat(cat: Category) {
    if (cat.name === 'Inclassable') {
      this.toast.show("La catégorie 'Inclassable' ne peut être supprimée.", 'warning');
      return;
    }

    if (
      confirm(
        `Supprimer la catégorie : "${cat.name}" ? Les formations liées seront déplacées vers "Inclassable".`,
      )
    ) {
      this.catService.deleteCategory(cat);
      this.toast.show('Catégorie supprimée.', 'info');
      setTimeout(() => this.loadTrainings(), 600);
    }
  }

  finishAction() {
    this.loadTrainings();
    this.resetForm();
  }

  resetForm() {
    this.isEditing.set(false);
    this.currentTraining = {
      name: '',
      description: '',
      price: 0,
      category: 'Inclassable',
      icon: 'bi-code-slash',
    };
  }
}
