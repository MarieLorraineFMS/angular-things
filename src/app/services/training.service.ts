import { Injectable } from '@angular/core';
import { Training } from '../models/training.model';

@Injectable({
  providedIn: 'root', // Dispo dans TOUTE l'app
})
export class TrainingService {
  constructor() {}

  /**
   * Retourne la liste des formations
   * @return Training[]
   */
  getTrainings(): Training[] {
    return [
      {
        id: 1,
        name: 'Java',
        price: 1500,
        description: 'Maîtrisez le langage backend de référence.',
        icon: 'bi-cup-hot',
      },
      {
        id: 2,
        name: 'Angular',
        price: 1200,
        description: 'Créez des applications web ultra-performantes.',
        icon: 'bi-shield-check',
      },
      {
        id: 3,
        name: 'TypeScript',
        price: 1000,
        description: 'Le JavaScript avec des super-pouvoirs.',
        icon: 'bi-filetype-tsx',
      },
    ];
  }
}
