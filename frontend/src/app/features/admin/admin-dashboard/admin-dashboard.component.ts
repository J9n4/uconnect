import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Users, Monitor, Clock, FileText, Check, X, ShieldAlert, Package, Plus, Briefcase, ChevronDown, ChevronRight, Trash2, Edit } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';
import { StudentDataService } from '../../../core/services/student-data.service';

interface AdminLoan {
  id: string;
  dbId: number;
  studentName: string;
  equipmentName: string;
  lab: string;
  date: string;
  status: 'Pendiente' | 'Aprobado' | 'Entregado' | 'Devuelto' | 'Rechazado';
  observaciones?: string;
}

interface EquipmentInventory {
  id: string;
  dbId: number;
  name: string;
  lab: string;
  total: number;
  available: number;
}

interface AdminUser {
  id: string;
  dbId: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  roleLabel: string;
}

interface AdminProfesor {
  dbId: number; // id_profesor
  idUsuario: number;
  name: string;
  email: string;
  department: string;
  title: string | null;
  status: string;
  expanded?: boolean;
  horarios?: any[];
  equipos?: any[];
  loadingDetails?: boolean;
}

interface ProfesorForm {
  id?: number;
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
  departamento: string;
  titulo: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private toastService = inject(ToastService);
  private studentDataService = inject(StudentDataService);
  private http = inject(HttpClient);

  readonly UsersIcon = Users;
  readonly MonitorIcon = Monitor;
  readonly ClockIcon = Clock;
  readonly FileTextIcon = FileText;
  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly AlertIcon = ShieldAlert;
  readonly PackageIcon = Package;
  readonly PlusIcon = Plus;
  readonly BriefcaseIcon = Briefcase;
  readonly ChevronDownIcon = ChevronDown;
  readonly ChevronRightIcon = ChevronRight;
  readonly Trash2Icon = Trash2;
  readonly EditIcon = Edit;

  activeTab: 'loans' | 'inventory' | 'users' | 'professors' = 'loans';

  stats = {
    totalUsers: 0,
    activeLoans: 0,
    pendingApprovals: 0,
    inventoryItems: 0,
    totalProfessors: 0
  };

  loans: AdminLoan[] = [];
  inventory: EquipmentInventory[] = [];
  usersList: AdminUser[] = [];
  professorsList: AdminProfesor[] = [];

  showProfesorModal = false;
  editingProfesor = false;
  currentProfesor: ProfesorForm = {
    nombre: '',
    apellido: '',
    correo: '',
    departamento: '',
    titulo: ''
  };

  showLoanModal = false;
  currentLoan: Partial<AdminLoan> = {};

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 1. Cargar Solicitudes de Préstamos
    this.studentDataService.equipmentRequests$.subscribe({
      next: (requests) => {
        this.loans = requests.map(r => {
          return {
            id: r.id,
            dbId: r.dbId,
            studentName: r.studentName || 'Estudiante',
            equipmentName: r.name,
            lab: r.lab,
            date: r.date,
            status: r.status as any,
            observaciones: r.observaciones
          };
        });
        this.calculateStats();
      }
    });

    // 2. Cargar Inventario de Equipos
    this.loadInventory();

    // 3. Cargar Usuarios
    this.loadUsers();

    // 4. Cargar Profesores
    this.loadProfessors();
  }

  loadProfessors() {
    this.http.get<any[]>('http://localhost:8000/api/profesores').subscribe({
      next: (profesores) => {
        this.professorsList = profesores.map(p => {
          const u = p.usuario;
          return {
            dbId: p.id_profesor,
            idUsuario: p.id_usuario,
            name: u ? `${u.nombre} ${u.apellido}` : 'Desconocido',
            email: u ? u.correo : 'Sin correo',
            department: p.departamento,
            title: p.titulo,
            status: p.estado,
            expanded: false
          };
        });
        this.stats.totalProfessors = this.professorsList.length;
      }
    });
  }

  loadInventory() {
    this.studentDataService.getEquipments().subscribe({
      next: (equipments) => {
        this.inventory = equipments.map(eq => {
          return {
            id: `EQ-${eq.id_equipo}`,
            dbId: eq.id_equipo,
            name: eq.nombre,
            lab: eq.ubicacion || 'Almacén Central',
            total: 1,
            available: eq.estado === 'Disponible' ? 1 : 0
          };
        });
        this.calculateStats();
      }
    });
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:8000/api/usuarios').subscribe({
      next: (users) => {
        this.usersList = users.map(u => {
          return {
            id: `USR-${u.id_usuario}`,
            dbId: u.id_usuario,
            name: `${u.nombre} ${u.apellido}`,
            email: u.correo,
            role: u.rol as any,
            roleLabel: u.rol === 'ADMIN' ? 'Administrador' : (u.rol === 'TEACHER' ? 'Profesor' : 'Estudiante')
          };
        });
        this.calculateStats();
      }
    });
  }

  calculateStats() {
    this.stats.totalUsers = this.usersList.length;
    this.stats.pendingApprovals = this.loans.filter(l => l.status === 'Pendiente').length;
    this.stats.activeLoans = this.loans.filter(l => l.status === 'Aprobado' || l.status === 'Entregado').length;
    this.stats.inventoryItems = this.inventory.length;
  }

  setTab(tab: 'loans' | 'inventory' | 'users' | 'professors') {
    this.activeTab = tab;
  }

  approveLoan(loan: AdminLoan) {
    this.studentDataService.approveEquipmentRequest(loan.id);
    this.toastService.show(`Préstamo ${loan.id} aprobado con éxito`, 'success');
  }

  rejectLoan(loan: AdminLoan) {
    // Al rechazar o cancelar, llamamos a la API
    this.studentDataService.cancelEquipment(loan.id);
    this.toastService.show(`Préstamo ${loan.id} rechazado`, 'error');
  }

  returnLoan(loan: AdminLoan) {
    this.studentDataService.returnEquipmentRequest(loan.id);
    this.toastService.show(`Equipo del préstamo ${loan.id} marcado como devuelto`, 'info');
  }

  editLoan(loan: AdminLoan) {
    this.currentLoan = { ...loan };
    this.showLoanModal = true;
  }

  closeLoanModal() {
    this.showLoanModal = false;
    this.currentLoan = {};
  }

  saveLoan() {
    if (this.currentLoan.id) {
      this.studentDataService.updateEquipmentRequest(this.currentLoan.id, {
        estado: this.currentLoan.status,
        observaciones: this.currentLoan.observaciones
      }).subscribe({
        next: () => {
          this.toastService.show('Préstamo actualizado exitosamente', 'success');
          this.closeLoanModal();
        },
        error: () => {
          this.toastService.show('Error al actualizar el préstamo', 'error');
        }
      });
    }
  }

  deleteLoan(loan: AdminLoan) {
    if (confirm(`¿Estás seguro de que deseas eliminar el préstamo ${loan.id}? Esta acción liberará el equipo si no lo estaba.`)) {
      this.studentDataService.deleteEquipmentRequest(loan.id).subscribe({
        next: () => {
          this.toastService.show('Préstamo eliminado exitosamente', 'success');
        },
        error: () => {
          this.toastService.show('Error al eliminar el préstamo', 'error');
        }
      });
    }
  }

  changeUserRole(user: AdminUser, newRole: 'STUDENT' | 'TEACHER' | 'ADMIN') {
    this.http.put(`http://localhost:8000/api/usuarios/${user.dbId}`, { rol: newRole }).subscribe({
      next: () => {
        user.role = newRole;
        user.roleLabel = newRole === 'STUDENT' ? 'Estudiante' : newRole === 'TEACHER' ? 'Profesor' : 'Administrador';
        this.toastService.show(`Rol de ${user.name} actualizado a ${user.roleLabel} en BD`, 'success');
        this.calculateStats();
      },
      error: () => {
        this.toastService.show('Error al actualizar el rol en la base de datos', 'error');
      }
    });
  }

  addEquipment() {
    const name = prompt('Ingrese el nombre del equipo:');
    if (!name) return;
    const description = prompt('Ingrese la descripción:');
    const location = prompt('Ingrese el laboratorio o ubicación:');

    this.studentDataService.addEquipment(name, description || '', location || 'Almacén Central').subscribe({
      next: () => {
        this.toastService.show('Equipo agregado exitosamente al inventario', 'success');
        this.loadInventory();
      },
      error: () => {
        this.toastService.show('Error al registrar el equipo en la base de datos.', 'error');
      }
    });
  }

  openProfesorModal(profesor?: AdminProfesor) {
    if (profesor) {
      this.editingProfesor = true;
      const [nombre, ...apellidoParts] = profesor.name.split(' ');
      this.currentProfesor = {
        id: profesor.dbId,
        idUsuario: profesor.idUsuario,
        nombre: nombre || '',
        apellido: apellidoParts.join(' ') || '',
        correo: profesor.email || '',
        departamento: profesor.department || '',
        titulo: profesor.title || ''
      };
    } else {
      this.editingProfesor = false;
      this.currentProfesor = {
        nombre: '',
        apellido: '',
        correo: '',
        departamento: '',
        titulo: '',
        contrasena: ''
      };
    }
    this.showProfesorModal = true;
  }

  closeProfesorModal() {
    this.showProfesorModal = false;
  }

  saveProfesor() {
    if (this.editingProfesor && this.currentProfesor.idUsuario && this.currentProfesor.id) {
      // Actualizar Usuario y Profesor
      const userPayload = {
        nombre: this.currentProfesor.nombre,
        apellido: this.currentProfesor.apellido,
        correo: this.currentProfesor.correo
      };
      if (this.currentProfesor.contrasena) {
        (userPayload as any).contrasena = this.currentProfesor.contrasena;
      }
      const profPayload = {
        departamento: this.currentProfesor.departamento,
        titulo: this.currentProfesor.titulo
      };

      forkJoin([
        this.http.put(`http://localhost:8000/api/usuarios/${this.currentProfesor.idUsuario}`, userPayload),
        this.http.put(`http://localhost:8000/api/profesores/${this.currentProfesor.id}`, profPayload)
      ]).subscribe({
        next: () => {
          this.toastService.show('Profesor actualizado con éxito', 'success');
          this.closeProfesorModal();
          this.loadProfessors();
          this.loadUsers();
        },
        error: () => this.toastService.show('Error al actualizar profesor', 'error')
      });
    } else {
      // Crear Usuario (esto creará el Profesor automáticamente gracias a tu fix en backend)
      const payload = {
        nombre: this.currentProfesor.nombre,
        apellido: this.currentProfesor.apellido,
        correo: this.currentProfesor.correo,
        contrasena: this.currentProfesor.contrasena || '123456',
        rol: 'PROFESOR',
        estado: 'Activo',
        departamento: this.currentProfesor.departamento,
        titulo: this.currentProfesor.titulo
      };
      this.http.post('http://localhost:8000/api/usuarios', payload).subscribe({
        next: () => {
          this.toastService.show('Profesor creado con éxito', 'success');
          this.closeProfesorModal();
          this.loadProfessors();
          this.loadUsers();
        },
        error: () => this.toastService.show('Error al crear profesor', 'error')
      });
    }
  }

  deleteProfesor(profesor: AdminProfesor) {
    if (confirm(`¿Estás seguro de eliminar a ${profesor.name}?`)) {
      this.http.delete(`http://localhost:8000/api/usuarios/${profesor.idUsuario}`).subscribe({
        next: () => {
          this.toastService.show('Profesor eliminado', 'success');
          this.loadProfessors();
          this.loadUsers();
        },
        error: () => this.toastService.show('Error al eliminar profesor', 'error')
      });
    }
  }

  toggleProfesorDetail(profesor: AdminProfesor) {
    profesor.expanded = !profesor.expanded;
    if (profesor.expanded && !profesor.horarios) {
      profesor.loadingDetails = true;
      forkJoin({
        horarios: this.http.get<any[]>(`http://localhost:8000/api/horarios-atencion?id_profesor=${profesor.dbId}`),
        prestamos: this.http.get<any[]>('http://localhost:8000/api/prestamos')
      }).subscribe({
        next: (res) => {
          profesor.horarios = res.horarios;
          // Los préstamos de profesores pueden requerir lógica de backend adicional, 
          // pero como administrador, podemos filtrar los equipos prestados por él
          profesor.equipos = res.prestamos.filter((p: any) => p.status === 'Aprobado' || p.status === 'Entregado'); // Adaptar según necesidades
          profesor.loadingDetails = false;
        },
        error: () => {
          profesor.loadingDetails = false;
        }
      });
    }
  }
}

