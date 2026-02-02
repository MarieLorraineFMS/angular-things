import { inject, Injectable, signal } from '@angular/core';
import { Training } from '../models/training.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import trainingsData from '../../assets/data/trainings.json';

@Injectable({
  providedIn: 'root', // Dispo dans TOUTE l'app
})
export class TrainingService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.ma-super-app.com/trainings';
  private trainings = signal<Training[]>(trainingsData);

  // Simule un appel réseau
  getTrainings(): Observable<Training[]> {
    // Renvoie nos données locales dans un tuyau Observable
    return of(trainingsData);
  }
}
