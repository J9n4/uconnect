import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, KeyRound } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './reset-password.component.html',
  styleUrl: '../recovery/recovery.component.css' // Reusamos los mismos estilos base
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  readonly ArrowLeftIcon = ArrowLeft;
  readonly KeyRoundIcon = KeyRound;

  resetForm = this.fb.group({
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    contrasena_confirmation: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  token: string | null = null;
  email: string | null = null;

  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');

    if (!this.token || !this.email) {
      this.errorMessage = 'Enlace de recuperación inválido o expirado.';
    }
  }

  passwordMatchValidator(g: any) {
    return g.get('contrasena').value === g.get('contrasena_confirmation').value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token || !this.email) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      token: this.token,
      correo: this.email,
      contrasena: this.resetForm.value.contrasena,
      contrasena_confirmation: this.resetForm.value.contrasena_confirmation
    };

    this.http.post('http://127.0.0.1:8000/api/reset-password', payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Ocurrió un error al intentar restablecer la contraseña.';
      }
    });
  }

  get f() { return this.resetForm.controls; }
}
