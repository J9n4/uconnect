import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Monitor, Clock, FileText, Check, X, Calendar, Edit } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';
import { StudentDataService, EquipmentRequest, TutorAppointment } from '../../../core/services/student-data.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-teacher-loans',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './teacher-loans.component.html',
  styleUrl: './teacher-loans.component.css'
})
export class TeacherLoansComponent implements OnInit {
  public studentDataService = inject(StudentDataService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  readonly MonitorIcon = Monitor;
  readonly ClockIcon = Clock;
  readonly FileTextIcon = FileText;
  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly CalendarIcon = Calendar;
  readonly EditIcon = Edit;

  activeTab: 'loans' | 'tutorings' = 'loans';

  // Modal para reagendar
  showRescheduleModal = false;
  selectedAppointment: TutorAppointment | null = null;

  rescheduleForm = {
    day: 'Lunes',
    startHour: 9,
    room: 'Sala de Tutorías',
    modality: 'Presencial' as 'Presencial' | 'Online'
  };

  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  timeSlots = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  equipmentRequests: EquipmentRequest[] = [];
  tutorAppointments: TutorAppointment[] = [];

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    const idProfesor = user?.id_profesor ?? user?.id;

    // Sincronizar dinámicamente con el servicio global
    this.studentDataService.equipmentRequests$.subscribe(reqs => {
      this.equipmentRequests = reqs;
    });

    this.studentDataService.tutorAppointments$.subscribe(apts => {
      // Filtrar tutorías del profesor logueado por id_profesor
      this.tutorAppointments = apts.filter(a => {
        if (!idProfesor) return true; // si no hay id, mostrar todos
        // El campo 'teacher' en tutorAppointments contiene el nombre, pero también
        // podemos comparar con el nombre del usuario logueado
        return a.teacher.toLowerCase().includes(user?.name?.split(' ')[0]?.toLowerCase() || '');
      });
    });
  }

  setTab(tab: 'loans' | 'tutorings') {
    this.activeTab = tab;
  }

  // --- ACCIONES DE PRÉSTAMOS ---
  approveLoan(loan: EquipmentRequest) {
    this.studentDataService.approveEquipmentRequest(loan.id);
    this.toastService.show(`Solicitud ${loan.id} aprobada. Notificación enviada al estudiante.`, 'success');
  }

  deliverLoan(loan: EquipmentRequest) {
    this.studentDataService.deliverEquipmentRequest(loan.id);
    this.toastService.show(`Préstamo ${loan.id} marcado como Entregado. Notificación enviada.`, 'success');
  }

  returnLoan(loan: EquipmentRequest) {
    this.studentDataService.returnEquipmentRequest(loan.id);
    this.toastService.show(`Equipo del préstamo ${loan.id} devuelto y verificado.`, 'info');
  }

  // --- ACCIONES DE TUTORÍAS ---
  acceptTutoring(apt: TutorAppointment) {
    this.studentDataService.acceptTutorAppointment(apt.id);
    this.toastService.show(`Tutoría de ${apt.studentName} aceptada. Alumno notificado.`, 'success');
  }

  rejectTutoring(apt: TutorAppointment) {
    this.studentDataService.rejectTutorAppointment(apt.id);
    this.toastService.show(`Tutoría de ${apt.studentName} rechazada/cancelada.`, 'error');
  }

  // --- MODAL DE REAGENDAMIENTO ---
  openReschedule(apt: TutorAppointment) {
    this.selectedAppointment = apt;
    this.rescheduleForm = {
      day: apt.day,
      startHour: apt.startHour,
      room: apt.room,
      modality: apt.modality
    };
    this.showRescheduleModal = true;
  }

  closeReschedule() {
    this.showRescheduleModal = false;
    this.selectedAppointment = null;
  }

  saveReschedule() {
    if (this.selectedAppointment) {
      this.studentDataService.rescheduleTutorAppointment(
        this.selectedAppointment.id,
        this.rescheduleForm.day,
        Number(this.rescheduleForm.startHour),
        this.rescheduleForm.room,
        this.rescheduleForm.modality
      );
      
      this.toastService.show(
        `Tutoría reprogramada para el ${this.rescheduleForm.day} a las ${this.rescheduleForm.startHour}:00 hrs. Alumno notificado.`,
        'success'
      );
      
      this.closeReschedule();
    }
  }
}
