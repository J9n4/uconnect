import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './features/teacher/teacher-dashboard/teacher-dashboard.component';
import { MessageCenterComponent } from './features/messages/message-center/message-center.component';
import { ReservationCenterComponent } from './features/reservations/reservation-center/reservation-center.component';
import { MyScheduleComponent } from './features/schedule/my-schedule/my-schedule.component';
import { MyRequestsComponent } from './features/reservations/my-requests/my-requests.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { TeacherLoansComponent } from './features/teacher/teacher-loans/teacher-loans.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'recovery', loadComponent: () => import('./features/auth/recovery/recovery.component').then(m => m.RecoveryComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'student/dashboard', component: StudentDashboardComponent },
      { path: 'teacher/dashboard', component: TeacherDashboardComponent },
      { path: 'admin/dashboard', component: AdminDashboardComponent },
      { path: 'teacher/loans', component: TeacherLoansComponent },
      { path: 'messages', component: MessageCenterComponent },
      { path: 'reservations', component: ReservationCenterComponent },
      { path: 'schedule', component: MyScheduleComponent },
      { path: 'my-requests', component: MyRequestsComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];