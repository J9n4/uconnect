import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Monitor, Users, Calendar, Clock, CheckCircle } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';
import { StudentDataService } from '../../../core/services/student-data.service';

@Component({
  selector: 'app-reservation-center',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reservation-center.component.html',
  styleUrl: './reservation-center.component.css'
})
export class ReservationCenterComponent {
  private toastService = inject(ToastService);
  private studentDataService = inject(StudentDataService);

  readonly MonitorIcon = Monitor;
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly CheckIcon = CheckCircle;

  activeTab: 'labs' | 'tutors' = 'labs';

  labEquipments = [
    { id: 1, name: 'Osciloscopio Digital', lab: 'Laboratorio de Electrónica', available: 3, total: 5, image: '📟' },
    { id: 2, name: 'Kit Arduino Mega', lab: 'Laboratorio de Robótica', available: 12, total: 15, image: '🤖' },
    { id: 3, name: 'Notebook HP ProBook', lab: 'Biblioteca Central', available: 0, total: 10, image: '💻' }
  ];

  // We will simulate real time scheduling by giving teachers a fixed day/hour for their next slot
  teachers: { id: number, name: string, subject: string, day: string, startHour: number, modality: 'Presencial' | 'Online', nextSlotStr: string }[] = [
    { id: 1, name: 'Osvaldo Baeza', subject: 'Desarrollo Frontend', day: 'Viernes', startHour: 15, modality: 'Presencial', nextSlotStr: 'Viernes, 15:00 hrs' },
    { id: 2, name: 'María González', subject: 'Bases de Datos', day: 'Jueves', startHour: 10, modality: 'Online', nextSlotStr: 'Jueves, 10:00 hrs' }
  ];

  setTab(tab: 'labs' | 'tutors') {
    this.activeTab = tab;
  }

  requestEquipment(item: any) {
    this.studentDataService.requestEquipment(item.name, item.lab);
    item.available--; // mock availability decrease
    this.toastService.show(`¡Solicitud de equipo enviada con éxito para: ${item.name}!`, 'success');
  }

  scheduleTutor(teacher: any) {
    this.studentDataService.scheduleAppointment(teacher.name, teacher.subject, teacher.day, teacher.startHour, teacher.modality);
    this.toastService.show(`¡Cita agendada con éxito con ${teacher.name}!`, 'success');
  }
}