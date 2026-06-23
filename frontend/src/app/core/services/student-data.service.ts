import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ClassSchedule {
  id: number | string;
  name: string;
  day: string;
  startHour: number;
  duration: number;
  room: string;
  type: 'lab' | 'theory' | 'workshop' | 'appointment';
  teacher?: string;
  modality?: string;
}

export interface EquipmentRequest {
  id: string;
  name: string;
  lab: string;
  date: string;
  status: 'Pendiente' | 'Aprobado' | 'Entregado' | 'Devuelto' | 'Cancelado';
  statusClass: 'pending' | 'approved' | 'delivered' | 'returned' | 'cancelled';
}

export interface TutorAppointment {
  id: string;
  teacher: string;
  subject: string;
  day: string;
  startHour: number;
  duration: number;
  modality: 'Presencial' | 'Online';
  room: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  private classesSubject = new BehaviorSubject<ClassSchedule[]>([
    { id: 1, name: 'Desarrollo Frontend', day: 'Lunes', startHour: 8, duration: 2, room: 'Lab 3', type: 'lab' },
    { id: 2, name: 'Bases de Datos', day: 'Martes', startHour: 10, duration: 2, room: 'Sala 402', type: 'theory' },
    { id: 3, name: 'Ingeniería de Software', day: 'Miércoles', startHour: 14, duration: 3, room: 'Sala 105', type: 'theory' },
    { id: 4, name: 'Desarrollo Frontend', day: 'Jueves', startHour: 9, duration: 2, room: 'Lab 3', type: 'lab' },
    { id: 5, name: 'Taller de Emprendimiento', day: 'Viernes', startHour: 11, duration: 2, room: 'Auditorio', type: 'workshop' }
  ]);

  private equipmentRequestsSubject = new BehaviorSubject<EquipmentRequest[]>([
    { id: 'REQ-102', name: 'Osciloscopio Digital', lab: 'Laboratorio de Electrónica', date: '22 Jun 2026', status: 'Aprobado', statusClass: 'approved' },
    { id: 'REQ-105', name: 'Kit Arduino Mega', lab: 'Laboratorio de Robótica', date: '23 Jun 2026', status: 'Pendiente', statusClass: 'pending' },
    { id: 'REQ-098', name: 'Notebook HP ProBook', lab: 'Biblioteca Central', date: '18 Jun 2026', status: 'Devuelto', statusClass: 'returned' }
  ]);

  private tutorAppointmentsSubject = new BehaviorSubject<TutorAppointment[]>([
    { id: 'APT-401', teacher: 'Prof. Osvaldo Baeza', subject: 'Desarrollo Frontend', day: 'Lunes', startHour: 15, duration: 1, modality: 'Presencial', room: 'Lab 3' }
  ]);

  classes$ = this.classesSubject.asObservable();
  equipmentRequests$ = this.equipmentRequestsSubject.asObservable();
  tutorAppointments$ = this.tutorAppointmentsSubject.asObservable();

  constructor() {
  }

  requestEquipment(name: string, lab: string) {
    const current = this.equipmentRequestsSubject.getValue();
    const newId = `REQ-${Math.floor(Math.random() * 900) + 100}`;
    
    // Obtener fecha actual formato DD MMM YYYY
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = today.toLocaleDateString('es-ES', options);

    const newReq: EquipmentRequest = {
      id: newId,
      name,
      lab,
      date: dateStr,
      status: 'Pendiente',
      statusClass: 'pending'
    };
    this.equipmentRequestsSubject.next([newReq, ...current]);
  }

  cancelEquipment(id: string) {
    const current = this.equipmentRequestsSubject.getValue();
    this.equipmentRequestsSubject.next(current.filter(req => req.id !== id));
  }

  scheduleAppointment(teacher: string, subject: string, day: string, startHour: number, modality: 'Presencial' | 'Online') {
    const current = this.tutorAppointmentsSubject.getValue();
    const newId = `APT-${Math.floor(Math.random() * 900) + 100}`;
    const newApt: TutorAppointment = {
      id: newId,
      teacher,
      subject,
      day,
      startHour,
      duration: 1, // Por defecto 1 hora
      modality,
      room: modality === 'Presencial' ? 'Sala de Tutorías' : 'Google Meet'
    };
    this.tutorAppointmentsSubject.next([newApt, ...current]);
  }

  cancelAppointment(id: string) {
    const current = this.tutorAppointmentsSubject.getValue();
    this.tutorAppointmentsSubject.next(current.filter(apt => apt.id !== id));
  }
}
