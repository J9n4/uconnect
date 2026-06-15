import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  })
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = true;

  loading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  login() {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Completa correo y contraseña.';
      return;
    }

    this.loading = true;

    // Simulación mientras no exista backend
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/dashboard-estudiante']);
    }, 900);
  }
}
