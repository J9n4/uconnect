import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.css'
})
export class MyScheduleComponent {
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly PinIcon = MapPin;

  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  // Generamos un arreglo de horas desde las 08:00 hasta las 18:00
  timeSlots = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  // Clases simuladas con su posición en la cuadrícula
  // startHour: la hora de inicio (ej. 8 para 08:00)
  // duration: cuántas horas dura el bloque
  classes = [
    { id: 1, name: 'Desarrollo Frontend', day: 'Lunes', startHour: 8, duration: 2, room: 'Lab 3', type: 'lab' },
    { id: 2, name: 'Bases de Datos', day: 'Martes', startHour: 10, duration: 2, room: 'Sala 402', type: 'theory' },
    { id: 3, name: 'Ingeniería de Software', day: 'Miércoles', startHour: 14, duration: 3, room: 'Sala 105', type: 'theory' },
    { id: 4, name: 'Desarrollo Frontend', day: 'Jueves', startHour: 9, duration: 2, room: 'Lab 3', type: 'lab' },
    { id: 5, name: 'Taller de Emprendimiento', day: 'Viernes', startHour: 11, duration: 2, room: 'Auditorio', type: 'workshop' }
  ];

  // Método para calcular si hay una clase en un día y hora específicos
  getClassForSlot(day: string, hourString: string) {
    const hour = parseInt(hourString.split(':')[0], 10);
    return this.classes.find(c => c.day === day && c.startHour === hour);
  }

  // Método para saber si debemos saltar la celda (porque una clase anterior ya la está ocupando por su duración)
  isSlotOccupied(day: string, hourString: string): boolean {
    const currentHour = parseInt(hourString.split(':')[0], 10);
    return this.classes.some(c => 
      c.day === day && 
      currentHour > c.startHour && 
      currentHour < (c.startHour + c.duration)
    );
  }
}