import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Message & couleur
  message = signal<string | null>(null);
  type = signal<'success' | 'danger'>('success');

  show(msg: string, type: 'success' | 'danger' = 'success') {
    this.message.set(msg);
    this.type.set(type);

    // Decompte vanish toaster (3s)
    setTimeout(() => {
      this.message.set(null);
    }, 3000);
  }
}
