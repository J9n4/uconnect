import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Usamos una Signal con un array de notificaciones para manejar múltiples Toasts a la vez
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  show(text: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = this.counter++;
    // Agregamos el nuevo toast a la lista de forma reactiva
    this.toasts.update(current => [...current, { id, text, type }]);

    // Auto-eliminar después de 3.5 segundos para que no saturen la pantalla
    setTimeout(() => {
      this.toasts.update(current => current.filter(t => t.id !== id));
    }, 3500);
  }
}