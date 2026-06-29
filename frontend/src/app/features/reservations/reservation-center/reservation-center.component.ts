import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, Monitor, Users, Calendar, Clock, CheckCircle, Search } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { StudentDataService } from '../../../core/services/student-data.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reservation-center',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './reservation-center.component.html',
  styleUrl: './reservation-center.component.css'
})
export class ReservationCenterComponent implements OnInit {
  private toastService = inject(ToastService);
  private studentDataService = inject(StudentDataService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  readonly MonitorIcon = Monitor;
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly CheckIcon = CheckCircle;
  readonly SearchIcon = Search;

  activeTab: 'labs' | 'tutors' = 'labs';

  labEquipments: any[] = [];
  searchQuery: string = '';
  teachers: any[] = [];

  get filteredEquipments() {
    if (!this.searchQuery) return this.labEquipments;
    const query = this.searchQuery.toLowerCase();
    return this.labEquipments.filter(eq => 
      eq.name.toLowerCase().includes(query) || 
      eq.lab.toLowerCase().includes(query)
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'tutors') {
        this.activeTab = 'tutors';
      } else if (params['tab'] === 'labs') {
        this.activeTab = 'labs';
      }
    });

    this.loadData();
  }

  loadData() {
    // Cargar equipos
    this.studentDataService.getEquipments().subscribe({
      next: (equipments) => {
        this.labEquipments = equipments.map(eq => {
          return {
            id: eq.id_equipo,
            name: eq.nombre,
            lab: eq.ubicacion || 'Almacén Central',
            available: eq.estado === 'Disponible' ? 1 : 0,
            total: 1,
            image: eq.nombre.toLowerCase().includes('laptop') || eq.nombre.toLowerCase().includes('notebook') ? '💻' :
                   (eq.nombre.toLowerCase().includes('arduino') ? '🤖' : '📟')
          };
        });
      }
    });

    // Cargar horarios de atención
    this.studentDataService.getAttentionHours().subscribe({
      next: (hours) => {
        this.teachers = hours.map(h => {
          return {
            id: h.id_horario,
            name: h.profesor && h.profesor.usuario ? 
                  `Dr. ${h.profesor.usuario.nombre} ${h.profesor.usuario.apellido}` : 'Docente',
            subject: h.profesor ? h.profesor.departamento : 'Programación Orientada a Objetos',
            day: h.dia_semana,
            startHour: h.hora_inicio,
            modality: h.modality || h.modalidad,
            nextSlotStr: `${h.dia_semana}, ${h.hora_inicio} hrs`,
            estado: h.estado
          };
        });
      }
    });
  }

  setTab(tab: 'labs' | 'tutors') {
    this.activeTab = tab;
  }

  requestEquipment(item: any) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.show('Inicia sesión para solicitar un préstamo.', 'error');
      return;
    }

    this.studentDataService.requestEquipment(item.id, user.id).subscribe({
      next: () => {
        item.available = 0;
        this.toastService.show(`¡Solicitud de equipo enviada con éxito para: ${item.name}!`, 'success');
        this.loadData();
      },
      error: () => {
        this.toastService.show('Error al registrar la solicitud en el servidor.', 'error');
      }
    });
  }

  scheduleTutor(hourBlock: any) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.show('Inicia sesión para agendar una tutoría.', 'error');
      return;
    }

    if (hourBlock.estado === 'Reservado' || hourBlock.estado === 'Aceptado') {
      this.toastService.show('Ese bloque horario ya está ocupado por otro alumno.', 'error');
      return;
    }

    const studentId = user.id_estudiante || user.id;

    this.studentDataService.scheduleAppointment(hourBlock.id, studentId).subscribe({
      next: () => {
        this.toastService.show(`¡Cita agendada con éxito con ${hourBlock.name}!`, 'success');
        this.loadData();
      },
      error: () => {
        this.toastService.show('Error de red al reservar el bloque.', 'error');
      }
    });
  }
}