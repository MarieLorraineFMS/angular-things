import { Routes } from '@angular/router';
import { TrainingsComponent } from './components/trainings/trainings.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'trainings',
    component: TrainingsComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
  },
  {
    path: '**',
    redirectTo: 'trainings',
  },
];
