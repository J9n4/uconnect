import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, MessageSquare, LogOut, Menu, User, Calendar, Clock, Users, Package, FileText, Bell, Monitor } from 'lucide-angular';
import { ToastContainerComponent } from '../../core/components/toast-container/toast-container.component';
import { AuthService, UserProfile } from '../../core/services/auth.service';

export interface SidebarLink {
  label: string;
  route: string;
  icon: any;
  queryParams?: any;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ToastContainerComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly LogoutIcon = LogOut;
  readonly MenuIcon = Menu;
  readonly UserIcon = User;
  readonly BellIcon = Bell;

  currentUser: UserProfile | null = null;
  navItems: SidebarLink[] = [];
  isSidebarCollapsed = false;

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.setupNavigation();
  }

  setupNavigation() {
    if (!this.currentUser) return;

    if (this.currentUser.role === 'STUDENT') {
      this.navItems = [
        { label: 'Dashboard', route: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Profesores', route: '/reservations', icon: Users, queryParams: { tab: 'tutors' } },
        { label: 'Horarios', route: '/schedule', icon: Clock },
        { label: 'Mensajes', route: '/messages', icon: MessageSquare },
        { label: 'Equipos', route: '/my-requests', icon: Monitor },
        { label: 'Solicitar Préstamo', route: '/reservations', icon: FileText, queryParams: { tab: 'labs' } }
      ];
    } else if (this.currentUser.role === 'TEACHER') {
      this.navItems = [
        { label: 'Dashboard', route: '/teacher/dashboard', icon: LayoutDashboard },
        { label: 'Mensajes', route: '/messages', icon: MessageSquare },
        { label: 'Horarios', route: '/schedule', icon: Clock },
        { label: 'Admin Préstamos', route: '/teacher/loans', icon: FileText },
        { label: 'Mi Perfil', route: '/teacher/dashboard', icon: User }
      ];
    } else if (this.currentUser.role === 'ADMIN') {
      this.navItems = [
        { label: 'Dashboard', route: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Mensajes', route: '/messages', icon: MessageSquare }
      ];
    }
  }

  get activePageTitle(): string {
    const url = this.router.url;
    if (url.includes('student/dashboard') || url.includes('teacher/dashboard') || url.includes('admin/dashboard')) {
      return 'Dashboard';
    }
    if (url.includes('messages')) return 'Mensajes';
    if (url.includes('reservations')) return 'Reservas';
    if (url.includes('my-requests')) return 'Mis Solicitudes';
    if (url.includes('schedule')) return 'Horarios';
    if (url.includes('loans')) return 'Admin Préstamos';
    return 'Uconnect';
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isNotificationOpen = false;

  toggleNotifications() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}