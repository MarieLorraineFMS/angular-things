import { Routes } from '@angular/router';
import { TrainingsComponent } from './components/trainings/trainings.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'trainings',
    pathMatch: 'full',
  },
  {
    path: 'trainings',
    component: TrainingsComponent,
  },
  {
    path: '**',
    redirectTo: 'trainings',
  },
];
