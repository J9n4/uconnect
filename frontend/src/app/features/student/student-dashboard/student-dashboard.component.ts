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

  studentFirstName = '';
  
  stats = {
    newMessages: 0,
    activeLoans: 0,
    availableEquipment: 0,
    notifications: 0
  };

  recentMessages: RecentMessage[] = [];
  activeLoans: ActiveLoan[] = [];
  notifications: StudentNotification[] = [];

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.studentFirstName = currentUser.name.split(' ')[0];
    }

    // Cargar mensajes recientes desde la API (datos reales)
    this.studentDataService.chats$.subscribe(chats => {
      const mensajesRecientes: RecentMessage[] = [];
      let totalNoLeidos = 0;

      chats.forEach(chat => {
        const mensajesDelChat = chat.messages.filter(m => m.sender === 'them');
        if (mensajesDelChat.length > 0) {
          const ultimo = mensajesDelChat[mensajesDelChat.length - 1];
          const esNoLeido = chat.unread > 0;
          totalNoLeidos += chat.unread;
          mensajesRecientes.push({
            senderName: chat.name,
            avatar: chat.avatar,
            text: ultimo.text,
            date: ultimo.time,
            isUnread: esNoLeido
          });
        }
      });

      // Ordenar: primero los no leídos, luego el resto
      mensajesRecientes.sort((a, b) => (b.isUnread ? 1 : 0) - (a.isUnread ? 1 : 0));

      this.recentMessages = mensajesRecientes.slice(0, 5);
      this.stats.newMessages = totalNoLeidos;
    });

    // Cargar notificaciones reales desde /api/notificaciones
    this.studentDataService.getNotifications().subscribe(notifs => {
      this.notifications = notifs.map(n => ({
        type: n.tipo === 'exito' ? 'success' : (n.tipo === 'advertencia' ? 'warning' : 'info') as 'success' | 'warning' | 'info',
        title: n.titulo,
        text: n.mensaje
      }));
      // Contar solo las no leídas como "nuevas hoy"
      this.stats.notifications = notifs.filter((n: any) => n.leida === 'No').length;
    });

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
      this.stats.availableEquipment = eqs.filter((e: any) => e.estado === 'Disponible').length;
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