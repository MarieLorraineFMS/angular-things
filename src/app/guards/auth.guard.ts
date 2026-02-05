import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * LE GARDE DU PONT-LEVIS
 * "As-tu ton badge d'habitant du château ?"
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // On demande au service si l'utilisateur actuel existe
  if (authService.currentUser()) {
    return true; // Le pont s'abaisse, tu peux passer !
  }

  // Si on n'est pas connecté, on est redirigé vers la page de login
  router.navigate(['/login']);
  return false;
};

/**
 * LA SALLE DU TRÔNE (Vérif ADMIN)
 * Verif si on a une couronne sur la tête.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verif si user 'ADMIN'
  if (authService.isAdmin()) {
    return true; // Bienvenue, Majesté !
  }

  // Si user => retour catalogue
  router.navigate(['/trainings']);
  return false;
};
