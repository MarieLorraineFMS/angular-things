import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Training } from '../models/training.model';
import { Category } from '../models/category.model';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = inject(ApiService);

  private categoriesSignal = signal<Category[]>([]);
  public list = this.categoriesSignal.asReadonly();

  private readonly DEFAULT_CAT = 'Inclassable';

  constructor() {
    this.refreshCategories();
  }

  refreshCategories() {
    this.api.get<Category[]>('categories').subscribe((data) => {
      this.categoriesSignal.set(data || []);
    });
  }

  //////////// CRÉER //////////
  addCategory(name: string) {
    const trimmed = name.trim();
    if (trimmed && !this.categoriesSignal().some((c) => c.name === trimmed)) {
      const newCat: Category = {
        id: Date.now().toString(), // ID unique
        name: trimmed,
      };

      this.api.post<Category>('categories', newCat).subscribe(() => {
        this.categoriesSignal.update((cats) => [...cats, newCat]);
      });
    }
  }

  //////////// RENOMMER (CASCADE) //////////
  renameCategory(categoryToRename: Category, newName: string) {
    if (categoryToRename.name === this.DEFAULT_CAT) return;

    // 1. MAJ formations
    this.api.get<Training[]>('trainings').subscribe((trainings) => {
      const trainingUpdates = trainings
        .filter((t) => t.category === categoryToRename.name)
        .map((t) => this.api.put(`trainings/${t.id}`, { ...t, category: newName }));

      // 2.MAJ catégorie
      const catUpdate = this.api.put(`categories/${categoryToRename.id}`, {
        ...categoryToRename,
        name: newName,
      });

      // 3. On balance tout
      forkJoin([...trainingUpdates, catUpdate]).subscribe(() => {
        this.refreshCategories(); // Reload pour être sûr
      });
    });
  }

  /////////// SUPPRIMER //////////

  deleteCategory(categoryToDelete: Category) {
    if (categoryToDelete.name === this.DEFAULT_CAT) return;

    this.api.get<Training[]>('trainings').subscribe((trainings) => {
      // "Inclassable"
      const moveTrainings = trainings
        .filter((t) => t.category === categoryToDelete.name)
        .map((t) => this.api.put(`trainings/${t.id}`, { ...t, category: this.DEFAULT_CAT }));

      // Delete catégorie du JSON
      const deleteCat = this.api.delete(`categories/${categoryToDelete.id}`);

      forkJoin([...moveTrainings, deleteCat]).subscribe(() => {
        this.refreshCategories();
      });
    });
  }
}
