import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, MailCheck } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.css'
})
export class RecoveryComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  // Iconos
  readonly ArrowLeftIcon = ArrowLeft;
  readonly MailCheckIcon = MailCheck;

  // Formulario
  recoveryForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  isSuccess = false; // Para mostrar el mensaje de éxito
  errorMessage = '';

  onSubmit() {
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = { correo: this.recoveryForm.value.email };

    this.http.post('http://127.0.0.1:8000/api/forgot-password', payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Ocurrió un error al intentar enviar el correo.';
      }
    });
  }

  get f() { return this.recoveryForm.controls; }
}