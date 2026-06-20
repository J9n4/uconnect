import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, MessageSquare, LogOut, Menu, User, Calendar, Clock } from 'lucide-angular';
import { ToastContainerComponent } from '../../core/components/toast-container/toast-container.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ToastContainerComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);

  readonly DashboardIcon = LayoutDashboard;
  readonly MessageIcon = MessageSquare;
  readonly LogoutIcon = LogOut;
  readonly MenuIcon = Menu;
  readonly UserIcon = User;
  readonly CalendarIcon = Calendar;
  readonly ScheduleIcon = Clock;

  dashboardRoute = '/student/dashboard';
  userRole = 'Estudiante';
  isSidebarCollapsed = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('uconnect_role');
      if (role === 'TEACHER') {
        this.dashboardRoute = '/teacher/dashboard';
        this.userRole = 'Docente';
      } else {
        this.dashboardRoute = '/student/dashboard';
        this.userRole = 'Estudiante';
      }
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('uconnect_role');
    this.router.navigate(['/login']);
  }
}