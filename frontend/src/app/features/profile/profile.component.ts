import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, BookOpen, GraduationCap, Clock, Plus, Trash, Check } from 'lucide-angular';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { StudentDataService, ClassSchedule } from '../../core/services/student-data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  readonly UserIcon = User;
  readonly BookIcon = BookOpen;
  readonly GraduationIcon = GraduationCap;
  readonly ClockIcon = Clock;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash;
  readonly CheckIcon = Check;

  currentUser: UserProfile | null = null;
  isTeacher = false;

  // Datos de edición del perfil
  profileForm = {
    name: '',
    specialty: '',
    career: 'Ingeniería Informática',
    bio: ''
  };

  // Gestión de horarios (para Profesores en perfil)
  officeHours: ClassSchedule[] = [];
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  timeSlots = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

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

    if (this.currentUser) {
      this.profileForm = {
        name: this.currentUser.name,
        specialty: this.currentUser.specialty,
        career: this.currentUser.role === 'STUDENT' ? this.currentUser.specialty : 'Ingeniería Informática',
        bio: this.currentUser.role === 'TEACHER' 
          ? 'Especialista en desarrollo de software y arquitectura de sistemas.' 
          : 'Estudiante enfocado en desarrollo de software web y bases de datos.'
      };
    }

    if (this.isTeacher) {
      this.loadOfficeHours();
    }
  }

  saveProfile() {
    this.authService.updateProfile(this.profileForm).subscribe({
      next: (newProfile) => {
        if (newProfile) {
          this.currentUser = newProfile;
          this.toastService.show('¡Perfil actualizado con éxito en la base de datos!', 'success');
        }
      },
      error: () => {
        this.toastService.show('Error de conexión al guardar el perfil.', 'error');
      }
    });
  }

  // --- HORARIOS DE ATENCIÓN (Solo Docentes) ---
  loadOfficeHours() {
    if (typeof window === 'undefined') return;
    const localSlotsStr = localStorage.getItem('uconnect_teacher_slots');
    if (localSlotsStr) {
      this.officeHours = JSON.parse(localSlotsStr);
    } else {
      this.officeHours = [
        { id: 'off-1', name: 'Atención de estudiantes', day: 'Miércoles', startHour: 9, duration: 2, room: 'Atención de estudiantes', type: 'appointment', modality: 'Presencial' }
      ];
      localStorage.setItem('uconnect_teacher_slots', JSON.stringify(this.officeHours));
    }
  }

  addOfficeHour() {
    const startHourNum = Number(this.newSlot.startHour);
    const durationNum = Number(this.newSlot.duration);

    if (this.hasConflict(this.newSlot.day, startHourNum, durationNum)) {
      this.toastService.show('Conflicto de horario: Ya tienes una actividad asignada.', 'error');
      return;
    }

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

    this.officeHours.push(newOfficeHour);
    localStorage.setItem('uconnect_teacher_slots', JSON.stringify(this.officeHours));
    this.toastService.show('Horario de atención añadido.', 'success');

    this.newSlot = {
      day: 'Lunes',
      startHour: 9,
      duration: 1,
      modality: 'Presencial',
      room: 'Sala de Tutorías'
    };
  }

  deleteOfficeHour(id: string | number) {
    this.officeHours = this.officeHours.filter(slot => slot.id !== id);
    localStorage.setItem('uconnect_teacher_slots', JSON.stringify(this.officeHours));
    this.toastService.show('Horario de atención eliminado.', 'info');
  }

  private hasConflict(day: string, startHour: number, duration: number): boolean {
    const endHour = startHour + duration;
    return this.officeHours.some(item => {
      if (item.day !== day) return false;
      const itemEndHour = item.startHour + item.duration;
      return startHour < itemEndHour && endHour > item.startHour;
    });
  }
}
