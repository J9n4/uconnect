import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
// 1. Importamos los iconos
import { LucideAngularModule, LogIn, Loader } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  // 2. Agregamos LucideAngularModule a los imports
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // 3. Declaramos los iconos para usarlos en el HTML
  readonly LogInIcon = LogIn;
  readonly LoaderIcon = Loader;

  private fb = inject(FormBuilder);
  private router = inject(Router);

  // ... (el resto del código queda exactamente igual)
  // Validaciones profesionales del formulario
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const credentials = this.loginForm.value;

    // Simulación de conexión al backend
    setTimeout(() => {
      this.isLoading = false;
      const email = credentials.email || '';
      
      // Simulación de Roles (RF-02) basado en el dominio del correo
      if (email.includes('@alumno.unach.cl')) {
        localStorage.setItem('uconnect_role', 'STUDENT');
        this.router.navigate(['/student/dashboard']); 
      } else if (email.includes('@profesor.unach.cl')) {
        localStorage.setItem('uconnect_role', 'TEACHER');
        this.router.navigate(['/teacher/dashboard']); 
      } else {
        this.errorMessage = 'Credenciales inválidas. Ingresa tu correo institucional válido.';
      }
    }, 1500);
  }

  // Helper para facilitar la validación en el HTML
  get f() { return this.loginForm.controls; }
}