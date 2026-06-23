import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Monitor, Users, Calendar, Clock, XCircle, AlertCircle, CheckCircle } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';
import { StudentDataService } from '../../../core/services/student-data.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css'
})
export class MyRequestsComponent {
  private toastService = inject(ToastService);
  public studentDataService = inject(StudentDataService);

  // Iconos profesionales
  readonly LabIcon = Monitor;
  readonly TutorIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly CancelIcon = XCircle;

  cancelEquipment(id: string, name: string) {
    this.studentDataService.cancelEquipment(id);
    this.toastService.show(`Cancelada la solicitud de: ${name}`, 'info');
  }

  rescheduleTutor(id: string, teacher: string) {
    // Para simplificar la demo, solo mostramos un toast. 
    // Idealmente abriría un modal para elegir nueva hora.
    this.toastService.show(`Función de reagendar no disponible en demo para ${teacher}`, 'info');
  }

  cancelTutor(id: string, teacher: string) {
    this.studentDataService.cancelAppointment(id);
    this.toastService.show(`Cita con ${teacher} cancelada correctamente`, 'success');
  }
}