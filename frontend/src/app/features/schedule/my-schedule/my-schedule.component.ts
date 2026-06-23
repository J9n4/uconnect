import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, MapPin, Users } from 'lucide-angular';
import { StudentDataService, ClassSchedule, TutorAppointment } from '../../../core/services/student-data.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.css'
})
export class MyScheduleComponent implements OnInit {
  private studentDataService = inject(StudentDataService);

  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly PinIcon = MapPin;
  readonly UsersIcon = Users;

  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  timeSlots = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  // Combina clases y citas en una sola lista unificada
  scheduleItems: ClassSchedule[] = [];

  ngOnInit() {
    combineLatest([
      this.studentDataService.classes$,
      this.studentDataService.tutorAppointments$
    ]).pipe(
      map(([classes, appointments]) => {
        const aptsAsClasses: ClassSchedule[] = appointments.map(apt => ({
          id: apt.id,
          name: `Tutoría: ${apt.subject}`,
          day: apt.day,
          startHour: apt.startHour,
          duration: apt.duration,
          room: apt.room,
          type: 'appointment',
          teacher: apt.teacher
        }));
        return [...classes, ...aptsAsClasses];
      })
    ).subscribe(items => {
      this.scheduleItems = items;
    });
  }

  getClassForSlot(day: string, hourString: string): ClassSchedule | undefined {
    const hour = parseInt(hourString.split(':')[0], 10);
    return this.scheduleItems.find(c => c.day === day && c.startHour === hour);
  }

  isSlotOccupied(day: string, hourString: string): boolean {
    const currentHour = parseInt(hourString.split(':')[0], 10);
    return this.scheduleItems.some(c =>
      c.day === day &&
      currentHour > c.startHour &&
      currentHour < (c.startHour + c.duration)
    );
  }

  /** Evita celdas extra cuando un rowspan de otra fila ya ocupa la columna. */
  shouldRenderDayCell(day: string, hourString: string): boolean {
    return !this.isSlotOccupied(day, hourString);
  }
}