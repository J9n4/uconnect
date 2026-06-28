import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api';

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
    const user = this.authService.getCurrentUser();
    const idProfesor = user?.id_profesor ?? user?.id;

    // Clases fijas del profesor
    const teacherClasses: ClassSchedule[] = [
      { id: 't-cls-1', name: 'Clase de Programación', day: 'Miércoles', startHour: 14, duration: 2, room: 'Sala de Programación', type: 'theory' }
    ];

    // Cargar horarios de atención desde la BD
    this.studentDataService.getAttentionHours().subscribe(horarios => {
      const propios = horarios.filter((h: any) => h.id_profesor === idProfesor);
      const officeHours: ClassSchedule[] = propios.map((h: any) => ({
        id: h.id_horario,
        name: 'Atención de estudiantes',
        day: h.dia_semana,
        startHour: parseInt(h.hora_inicio?.split(':')[0] || '8'),
        duration: parseInt(h.hora_fin?.split(':')[0] || '9') - parseInt(h.hora_inicio?.split(':')[0] || '8'),
        room: h.ubicacion || 'Sala de Tutorías',
        type: 'appointment' as const,
        modality: h.modalidad
      }));
      this.scheduleItems = [...teacherClasses, ...officeHours];
    });
  }

  addOfficeHour() {
    if (!this.isTeacher) return;
    const user = this.authService.getCurrentUser();
    const idProfesor = user?.id_profesor ?? user?.id;
    if (!idProfesor) {
      this.toastService.show('No se encontró el ID del profesor.', 'error');
      return;
    }

    const startHourNum = Number(this.newSlot.startHour);
    const durationNum = Number(this.newSlot.duration);

    if (this.hasConflict(this.newSlot.day, startHourNum, durationNum)) {
      this.toastService.show('Ese horario ya está ocupado por otra clase o tutoría.', 'error');
      return;
    }

    const endHour = startHourNum + durationNum;
    const payload = {
      id_profesor: idProfesor,
      dia_semana: this.newSlot.day,
      hora_inicio: `${startHourNum.toString().padStart(2, '0')}:00`,
      hora_fin: `${endHour.toString().padStart(2, '0')}:00`,
      modalidad: this.newSlot.modality,
      ubicacion: this.newSlot.room,
      estado: 'Disponible'
    };

    this.http.post(`${this.apiUrl}/horarios-atencion`, payload).subscribe({
      next: () => {
        this.toastService.show('¡Horario de atención añadido con éxito!', 'success');
        this.loadTeacherSlots();
        this.newSlot = { day: 'Lunes', startHour: 9, duration: 1, modality: 'Presencial', room: 'Sala de Tutorías' };
      },
      error: () => this.toastService.show('Error al guardar el horario en la BD.', 'error')
    });
  }

  deleteOfficeHour(id: string | number) {
    if (!this.isTeacher) return;

    this.http.delete(`${this.apiUrl}/horarios-atencion/${id}`).subscribe({
      next: () => {
        this.toastService.show('Horario de atención eliminado.', 'info');
        this.loadTeacherSlots();
      },
      error: () => this.toastService.show('Error al eliminar el horario de la BD.', 'error')
    });
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