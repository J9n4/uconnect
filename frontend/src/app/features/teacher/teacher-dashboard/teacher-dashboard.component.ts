import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, MessageSquare, FileText, Users, Clock, ChevronRight, Calendar, BookOpen } from 'lucide-angular';

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
export class TeacherDashboardComponent {
  private router = inject(Router);

  readonly MessageIcon = MessageSquare;
  readonly FileTextIcon = FileText;
  readonly UsersIcon = Users;
  readonly ClockIcon = Clock;
  readonly BookIcon = BookOpen;
  readonly CalendarIcon = Calendar;
  readonly ChevronIcon = ChevronRight;

  teacherName = 'Dr. Miguel Ángel Torres';
  specialty = 'Programación Orientada a Objetos';
  currentDay = 'miércoles, 24 de junio';

  stats = {
    newMessages: 2,
    pendingRequests: 2,
    activeStudents: 24,
    todayHours: '2h'
  };

  messages: StudentMessage[] = [
    {
      id: 1,
      studentName: 'Carlos Martínez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      text: 'Profesor, tengo una duda sobre el proyecto final de POO.',
      date: '9 jun, 09:15',
      isUnread: true
    },
    {
      id: 2,
      studentName: 'Laura Gómez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      text: 'Gracias por la retroalimentación, ya corregí el código.',
      date: '8 jun, 16:30',
      isUnread: true
    },
    {
      id: 3,
      studentName: 'Andrés Sánchez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      text: '¿Podría revisar mi avance antes de la entrega del viernes?',
      date: '8 jun, 11:45',
      isUnread: false
    }
  ];

  todaySchedules: TodaySchedule[] = [
    { time: '09:00 - 11:00', title: 'Atención de estudiantes', icon: 'clock' },
    { time: '14:00 - 16:00', title: 'Clase de Programación', icon: 'book' }
  ];

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