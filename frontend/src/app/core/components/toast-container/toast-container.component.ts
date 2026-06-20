import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, CheckCircle, AlertTriangle, Info } from 'lucide-angular';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  // Inyectamos nuestro servicio profesional de Toasts
  toastService = inject(ToastService);

  // Iconos para cada tipo de alerta
  readonly SuccessIcon = CheckCircle;
  readonly ErrorIcon = AlertTriangle;
  readonly InfoIcon = Info;
}