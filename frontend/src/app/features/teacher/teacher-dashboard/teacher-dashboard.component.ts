import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, MessageSquare, FileText, Users, Clock, ChevronRight, Calendar, BookOpen } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { StudentDataService } from '../../../core/services/student-data.service';

interface StudentMessage {
  id: number;
  studentName: string;
  avatar: string;
  text: string;
  date: string;
  isUnread: boolean;
}

interface TodaySchedule {
  time: string;
  title: string;
  icon: 'clock' | 'book';
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private studentDataService = inject(StudentDataService);

  readonly MessageIcon = MessageSquare;
  readonly FileTextIcon = FileText;
  readonly UsersIcon = Users;
  readonly ClockIcon = Clock;
  readonly BookIcon = BookOpen;
  readonly CalendarIcon = Calendar;
  readonly ChevronIcon = ChevronRight;

  teacherName = '';
  specialty = '';
  currentDay = '';

  stats = {
    newMessages: 0,
    pendingRequests: 0,
    activeStudents: 0,
    todayHours: '0h',
    pendingEq: 0,
    pendingTutor: 0
  };

  messages: StudentMessage[] = [];
  todaySchedules: TodaySchedule[] = [];

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.teacherName = user.name;
      this.specialty = user.departamento || user.specialty || 'Docente';
    }

    // Fecha de hoy formateada
    const now = new Date();
    this.currentDay = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    // Mensajes recientes desde la BD
    this.studentDataService.chats$.subscribe(chats => {
      const allMessages: StudentMessage[] = [];
      let unread = 0;
      chats.forEach(chat => {
        const last = chat.messages[chat.messages.length - 1];
        if (last && last.sender === 'them') {
          allMessages.push({
            id: chat.id,
            studentName: chat.name,
            avatar: chat.avatar,
            text: last.text,
            date: last.time,
            isUnread: chat.unread > 0
          });
          if (chat.unread > 0) unread++;
        }
      });
      this.messages = allMessages.slice(0, 3);
      this.stats.newMessages = unread;
    });

    // Préstamos pendientes desde la BD
    this.studentDataService.equipmentRequests$.subscribe(reqs => {
      this.stats.pendingEq = reqs.filter(r => r.status === 'Pendiente').length;
      this.stats.pendingRequests = this.stats.pendingEq + this.stats.pendingTutor;
    });

    // Tutorías pendientes desde la BD
    this.studentDataService.tutorAppointments$.subscribe(apts => {
      const myApts = apts.filter(a => {
        if (!user?.name) return true;
        return a.teacher.toLowerCase().includes(user.name.split(' ')[0].toLowerCase());
      });
      this.stats.pendingTutor = myApts.filter(a => a.status === 'Pendiente').length;
      this.stats.pendingRequests = this.stats.pendingEq + this.stats.pendingTutor;
      
      // Estudiantes activos (Tutorías agendadas)
      this.stats.activeStudents = myApts.length;
    });

    // Horarios de atención del profesor logueado
    this.studentDataService.getAttentionHours().subscribe(horarios => {
      const idProfesor = Number(user?.id_profesor ?? user?.id);
      // Asegurar que comparamos como números
      const propios = horarios.filter(h => Number(h.id_profesor) === idProfesor || Number(h.profesor?.id_usuario) === idProfesor);
      
      const todayStr = new Date().toISOString().split('T')[0];
      const propiosToday = propios.filter(h => h.dia_semana && h.dia_semana.startsWith(todayStr));

      const totalMinutes = propiosToday.reduce((acc: number, h: any) => {
        const start = parseInt(h.hora_inicio?.split(':')[0] || '0');
        const end = parseInt(h.hora_fin?.split(':')[0] || '0');
        return acc + (end - start);
      }, 0);
      this.stats.todayHours = `${totalMinutes}h`;

      this.todaySchedules = propiosToday.map((h: any) => ({
        time: `${h.hora_inicio?.substring(0,5)} - ${h.hora_fin?.substring(0,5)}`,
        title: h.estado === 'Disponible' ? 'Atención de estudiantes' : `Tutoría (${h.modalidad})`,
        icon: 'clock' as 'clock'
      }));

      if (this.todaySchedules.length === 0) {
        // Agregar clase fija solo como relleno si no hay horarios de tutoría hoy
        this.todaySchedules.push({ time: '14:00 - 16:00', title: 'Clases de Asignatura', icon: 'book' });
      }
    });
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }

  goToLoans() {
    this.router.navigate(['/teacher/loans']);
  }

  goToSchedule() {
    this.router.navigate(['/schedule']);
  }
}