import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { LucideAngularModule, LogIn, Loader } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly LogInIcon = LogIn;
  readonly LoaderIcon = Loader;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

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
    const email = this.loginForm.value.email || '';
    const password = this.loginForm.value.password || '';

    this.authService.login(email, password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.redirectUser();
        } else {
          this.errorMessage = 'Credenciales inválidas. Ingresa tu correo institucional registrado.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error de conexión con la base de datos de Uconnect.';
      }
    });
  }

  quickLogin(role: 'student' | 'teacher' | 'admin') {
    this.isLoading = true;
    this.errorMessage = '';
    
    let email = '';
    let quickPassword = 'password';
    if (role === 'student') {
      email = 'alumno1@alumno.unach.cl';
      quickPassword = '97582635';
    } else if (role === 'teacher') {
      email = 'miguel@profesor.unach.cl';
    } else if (role === 'admin') {
      email = 'admin@unach.cl';
    }

    this.loginForm.patchValue({
      email: email,
      password: quickPassword
    });

    this.authService.login(email, quickPassword).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.redirectUser();
        } else {
          this.errorMessage = 'Error al ingresar rápido.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

  private redirectUser() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (user.role === 'STUDENT') {
      this.router.navigate(['/student/dashboard']);
    } else if (user.role === 'TEACHER') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (user.role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  get f() { return this.loginForm.controls; }
}