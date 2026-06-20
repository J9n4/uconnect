import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Monitor, BookOpen, Clock, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  readonly MonitorIcon = Monitor;
  readonly BookOpenIcon = BookOpen;
  readonly ClockIcon = Clock;
  readonly AlertIcon = AlertCircle;

  studentName = 'Juan';
  activeLoans = 1;
  unreadMessages = 3;
}