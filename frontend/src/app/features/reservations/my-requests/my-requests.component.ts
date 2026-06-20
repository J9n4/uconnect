import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Monitor, Users, Calendar, Clock, XCircle, AlertCircle, CheckCircle } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css'
})
export class MyRequestsComponent {
  private toastService = inject(ToastService);

  // Iconos profesionales
  readonly LabIcon = Monitor;
  readonly TutorIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly CancelIcon = XCircle;

  // Estado simulado de Pedidos de Equipos
  equipmentRequests = [
    { id: 'REQ-102', name: 'Osciloscopio Digital', lab: 'Laboratorio de Electrónica', date: '22 Jun 2026', status: 'Aprobado', statusClass: 'approved' },
    { id: 'REQ-105', name: 'Kit Arduino Mega', lab: 'Laboratorio de Robótica', date: '23 Jun 2026', status: 'Pendiente', statusClass: 'pending' },
    { id: 'REQ-098', name: 'Notebook HP ProBook', lab: 'Biblioteca Central', date: '18 Jun 2026', status: 'Devuelto', statusClass: 'returned' }
  ];

  // Estado simulado de Consultas/Tutorías con Profesores
  tutorAppointments = [
    { id: 'APT-401', teacher: 'Prof. Osvaldo Baeza', subject: 'Desarrollo Frontend', dateTime: 'Hoy, 15:00 hrs', modality: 'Presencial', room: 'Laboratorio 3' },
    { id: 'APT-402', teacher: 'Dra. María González', subject: 'Bases de Datos', dateTime: 'Mañana, 10:00 hrs', modality: 'Online', room: 'Microsoft Teams' }
  ];

  cancelEquipment(id: string, name: string) {
    this.equipmentRequests = this.equipmentRequests.filter(req => req.id !== id);
    this.toastService.show(`Cancelada la solicitud de: ${name}`, 'info');
  }

  rescheduleTutor(id: string, teacher: string) {
    // Simulamos un cambio rápido de horario para demostrar la reactividad en UI
    const apt = this.tutorAppointments.find(a => a.id === id);
    if (apt) {
      apt.dateTime = 'Próximo Jueves, 11:00 hrs';
      this.toastService.show(`Cita con ${teacher} reagendada con éxito`, 'success');
    }
  }

  cancelTutor(id: string, teacher: string) {
    this.tutorAppointments = this.tutorAppointments.filter(apt => apt.id !== id);
    this.toastService.show(`Cita con ${teacher} cancelada correctamente`, 'error');
  }
}