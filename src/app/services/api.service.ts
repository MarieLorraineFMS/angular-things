import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}/${path}`).pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body).pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body).pipe(catchError(this.handleError));
  }

  delete(path: string) {
    return this.http.delete(`${this.baseUrl}/${path}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue !';
    if (error.status === 0) {
      // !Serveur
      errorMessage = 'Impossible de contacter le serveur. Vérifie que JSON Server est lancé !';
    } else if (error.status === 404) {
      errorMessage = "La ressource demandée n'existe pas (Erreur 404).";
    } else {
      // Erreur code ou serveur
      errorMessage = `Erreur serveur : ${error.status}. Message : ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
