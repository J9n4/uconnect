import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar, Clock, MapPin, Users, Plus, Trash } from 'lucide-angular';
import { StudentDataService, ClassSchedule } from '../../../core/services/student-data.service';
import { AuthService, UserProfile } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.css'
})
export class MyScheduleComponent implements OnInit {
  private studentDataService = inject(StudentDataService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly PinIcon = MapPin;
  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash;

  currentUser: UserProfile | null = null;
  isTeacher = false;

  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  timeSlots = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  // Combina clases y citas en una sola lista unificada
  scheduleItems: ClassSchedule[] = [];

  // Formulario para nuevo horario de atención (docente)
  newSlot = {
    day: 'Lunes',
    startHour: 9,
    duration: 1,
    modality: 'Presencial' as 'Presencial' | 'Online',
    room: 'Sala de Tutorías'
  };

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isTeacher = this.currentUser?.role === 'TEACHER';

    if (this.isTeacher) {
      this.loadTeacherSlots();
    } else {
      this.loadStudentSlots();
    }
  }

  loadStudentSlots() {
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
          teacher: apt.teacher,
          modality: apt.modality
        }));
        return [...classes, ...aptsAsClasses];
      })
    ).subscribe(items => {
      this.scheduleItems = items;
    });
  }

  loadTeacherSlots() {
    if (typeof window === 'undefined') return;

    // Cargar clases fijas del profesor
    const teacherClasses: ClassSchedule[] = [
      { id: 't-cls-1', name: 'Clase de Programación', day: 'Miércoles', startHour: 14, duration: 2, room: 'Sala de Programación', type: 'theory' }
    ];

    // Cargar horarios de atención personalizados
    let officeHours: ClassSchedule[] = [];
    const localSlotsStr = localStorage.getItem('uconnect_teacher_slots');

    if (localSlotsStr) {
      officeHours = JSON.parse(localSlotsStr);
    } else {
      // Valores por defecto para la demo inicial del profesor (coincide con dashboard mockup)
      officeHours = [
        { id: 'off-1', name: 'Atención de estudiantes', day: 'Miércoles', startHour: 9, duration: 2, room: 'Atención de estudiantes', type: 'appointment', modality: 'Presencial' }
      ];
      localStorage.setItem('uconnect_teacher_slots', JSON.stringify(officeHours));
    }

    this.scheduleItems = [...teacherClasses, ...officeHours];
  }

  addOfficeHour() {
    if (!this.isTeacher) return;

    const startHourNum = Number(this.newSlot.startHour);
    const durationNum = Number(this.newSlot.duration);

    // Validar conflictos de horario
    if (this.hasConflict(this.newSlot.day, startHourNum, durationNum)) {
      this.toastService.show('Ese horario ya está ocupado por otra clase o tutoría.', 'error');
      return;
    }

    // Guardar horario
    const localSlotsStr = localStorage.getItem('uconnect_teacher_slots');
    let officeHours: ClassSchedule[] = localSlotsStr ? JSON.parse(localSlotsStr) : [];

    const newOfficeHour: ClassSchedule = {
      id: `off-${Date.now()}`,
      name: 'Atención de estudiantes',
      day: this.newSlot.day,
      startHour: startHourNum,
      duration: durationNum,
      room: this.newSlot.room,
      type: 'appointment',
      modality: this.newSlot.modality
    };

    officeHours.push(newOfficeHour);
    localStorage.setItem('uconnect_teacher_slots', JSON.stringify(officeHours));

    this.loadTeacherSlots();
    this.toastService.show('¡Horario de atención añadido con éxito!', 'success');

    // Resetear formulario con valores por defecto cómodos
    this.newSlot = {
      day: 'Lunes',
      startHour: 9,
      duration: 1,
      modality: 'Presencial',
      room: 'Sala de Tutorías'
    };
  }

  deleteOfficeHour(id: string | number) {
    if (!this.isTeacher) return;

    const localSlotsStr = localStorage.getItem('uconnect_teacher_slots');
    if (!localSlotsStr) return;

    let officeHours: ClassSchedule[] = JSON.parse(localSlotsStr);
    officeHours = officeHours.filter(slot => slot.id !== id);
    localStorage.setItem('uconnect_teacher_slots', JSON.stringify(officeHours));

    this.loadTeacherSlots();
    this.toastService.show('Horario de atención eliminado.', 'info');
  }

  private hasConflict(day: string, startHour: number, duration: number): boolean {
    const endHour = startHour + duration;
    return this.scheduleItems.some(item => {
      if (item.day !== day) return false;
      const itemEndHour = item.startHour + item.duration;
      // Condición de solapamiento
      return startHour < itemEndHour && endHour > item.startHour;
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

  shouldRenderDayCell(day: string, hourString: string): boolean {
    return !this.isSlotOccupied(day, hourString);
  }
}