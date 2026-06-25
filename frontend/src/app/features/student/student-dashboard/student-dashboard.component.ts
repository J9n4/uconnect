import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, MessageSquare, Monitor, Clock, Bell, Check, Info } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { StudentDataService } from '../../../core/services/student-data.service';

interface RecentMessage {
  senderName: string;
  avatar: string;
  text: string;
  date: string;
  isUnread: boolean;
}

interface ActiveLoan {
  name: string;
  status: 'Activo' | 'Vencido';
  returnDate: string;
}

interface StudentNotification {
  type: 'success' | 'warning' | 'info';
  title: string;
  text: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private studentDataService = inject(StudentDataService);
  private router = inject(Router);

  // Iconos
  readonly MessageIcon = MessageSquare;
  readonly MonitorIcon = Monitor;
  readonly ClockIcon = Clock;
  readonly BellIcon = Bell;
  readonly CheckIcon = Check;
  readonly InfoIcon = Info;

  studentFirstName = 'Carlos';
  
  stats = {
    newMessages: 2,
    activeLoans: 0,
    availableEquipment: 5,
    notifications: 2
  };

  recentMessages: RecentMessage[] = [
    {
      senderName: 'Dr. Miguel Ángel Torres',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
      text: 'Hola Carlos, he revisado tu proyecto y está excelente. Solo necesitas ajustar la sección de pruebas unitarias.',
      date: '28 may, 09:30',
      isUnread: true
    },
    {
      senderName: 'Dra. Elena Vargas',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      text: 'Recuerda que la tarea de ecuaciones diferenciales se entrega este viernes.',
      date: '27 may, 16:45',
      isUnread: false
    },
    {
      senderName: 'Dra. Ana María López',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      text: 'Tu consulta sobre normalización está resuelta. Revisa el documento que te envié.',
      date: '26 may, 11:20',
      isUnread: false
    }
  ];

  activeLoans: ActiveLoan[] = [];

  notifications: StudentNotification[] = [
    {
      type: 'success',
      title: 'Préstamo aprobado',
      text: 'Tu solicitud de equipo ha sido registrada exitosamente.'
    },
    {
      type: 'info',
      title: 'Nuevo mensaje',
      text: 'Dr. Torres te ha enviado un mensaje.'
    }
  ];

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.studentFirstName = currentUser.name.split(' ')[0];
    }

    // Cargar préstamos activos del alumno desde la base de datos
    this.studentDataService.equipmentRequests$.subscribe(reqs => {
      this.activeLoans = reqs
        .filter(r => r.status === 'Aprobado' || r.status === 'Entregado')
        .map(r => {
          return {
            name: r.name,
            status: r.status === 'Aprobado' ? 'Activo' : 'Vencido' as any,
            returnDate: r.date
          };
        });
      this.stats.activeLoans = this.activeLoans.length;
    });

    // Cargar estadísticas de equipos
    this.studentDataService.getEquipments().subscribe(eqs => {
      this.stats.availableEquipment = eqs.filter(e => e.estado === 'Disponible').length;
    });
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }

  goToLoans() {
    this.router.navigate(['/my-requests']);
  }

  goToRequestLoan() {
    this.router.navigate(['/reservations'], { queryParams: { tab: 'labs' } });
  }
}