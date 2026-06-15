import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardEstudianteComponent } from './pages/dashboard-estudiante/dashboard-estudiante.component';
import { DashboardProfesorComponent } from './pages/dashboard-profesor/dashboard-profesor.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { AuthLayoutComponent } from './auth/auth-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'dashboard-estudiante', component: DashboardEstudianteComponent },
      { path: 'dashboard-profesor', component: DashboardProfesorComponent },
      { path: 'dashboard-admin', component: DashboardAdminComponent },
    ],
  },
];
