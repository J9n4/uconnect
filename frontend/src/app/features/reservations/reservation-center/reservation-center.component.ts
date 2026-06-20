import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Monitor, Users, Calendar, Clock, CheckCircle } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reservation-center',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reservation-center.component.html',
  styleUrl: './reservation-center.component.css'
})
export class ReservationCenterComponent {
  private toastService = inject(ToastService);

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

  teachers = [
    { id: 1, name: 'Osvaldo Baeza', subject: 'Desarrollo Frontend', nextSlot: 'Hoy, 15:00 hrs', modality: 'Presencial' },
    { id: 2, name: 'María González', subject: 'Bases de Datos', nextSlot: 'Mañana, 10:00 hrs', modality: 'Online' }
  ];

  setTab(tab: 'labs' | 'tutors') {
    this.activeTab = tab;
  }

  requestReservation(itemName: string) {
    this.toastService.show(`¡Solicitud enviada con éxito para: ${itemName}!`, 'success');
  }
}