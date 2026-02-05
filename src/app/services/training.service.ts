import { inject, Injectable } from '@angular/core';
import { Training } from '../models/training.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private api = inject(ApiService);

  getTrainings() {
    return this.api.get<Training[]>('trainings');
  }

  getTrainingById(id: number): Observable<Training> {
    return this.api.get<Training>(`trainings/${id}`);
  }

  addTraining(training: Training): Observable<Training> {
    return this.api.post<Training>('trainings', training);
  }

  updateTraining(id: string, training: Training): Observable<Training> {
    return this.api.post<Training>(`trainings/${id}`, training);
  }

  deleteTraining(id: string): Observable<void> {
    return this.api.post<void>(`trainings/${id}/delete`, {});
  }
}
