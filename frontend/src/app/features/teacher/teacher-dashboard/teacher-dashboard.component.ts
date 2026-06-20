import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, Calendar, MessageSquare, Clock } from 'lucide-angular';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent {
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly MessageIcon = MessageSquare;
  readonly ClockIcon = Clock;

  teacherName = 'Osvaldo Baeza';
  pendingMessages = 5;
  todaySchedules = 2;

  upcomingSchedules = [
    { day: 'Hoy', time: '15:00 - 16:30', modality: 'Presencial', room: 'Laboratorio 3' },
    { day: 'Mañana', time: '10:00 - 11:30', modality: 'Online', room: 'Teams' }
  ];
}