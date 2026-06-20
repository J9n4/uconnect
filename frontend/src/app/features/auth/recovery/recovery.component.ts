import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, MailCheck } from 'lucide-angular';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.css'
})
export class RecoveryComponent {
  private fb = inject(FormBuilder);

  // Iconos
  readonly ArrowLeftIcon = ArrowLeft;
  readonly MailCheckIcon = MailCheck;

  // Formulario
  recoveryForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  isSuccess = false; // Para mostrar el mensaje de éxito

  onSubmit() {
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simulamos la llamada a tu API de Laravel
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 1500);
  }

  get f() { return this.recoveryForm.controls; }
}