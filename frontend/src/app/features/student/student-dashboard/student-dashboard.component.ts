import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Monitor, BookOpen, Clock, AlertCircle } from 'lucide-angular';
import { StudentDataService } from '../../../core/services/student-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  private studentDataService = inject(StudentDataService);

  readonly MonitorIcon = Monitor;
  readonly BookOpenIcon = BookOpen;
  readonly ClockIcon = Clock;
  readonly AlertIcon = AlertCircle;

  studentName = 'Juan';
  unreadMessages = 3;

  activeLoans$!: Observable<number>;
  nextActivity$!: Observable<{ title: string, time: string } | null>;

  ngOnInit() {
    this.activeLoans$ = this.studentDataService.equipmentRequests$.pipe(
      map(reqs => reqs.filter(r => r.status === 'Pendiente' || r.status === 'Aprobado' || r.status === 'Entregado').length)
    );

    this.nextActivity$ = this.studentDataService.tutorAppointments$.pipe(
      map(apts => {
        if (apts.length > 0) {
          return { title: 'Tutoría: ' + apts[0].subject, time: apts[0].day + ', ' + apts[0].startHour + ':00 hrs' };
        }
        return null;
      })
    );
  }
}