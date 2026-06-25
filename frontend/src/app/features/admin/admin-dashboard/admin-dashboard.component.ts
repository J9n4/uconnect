import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Users, Monitor, Clock, FileText, Check, X, ShieldAlert, Package, Plus } from 'lucide-angular';
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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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

  activeTab: 'loans' | 'inventory' | 'users' = 'loans';

  stats = {
    totalUsers: 0,
    activeLoans: 0,
    pendingApprovals: 0,
    inventoryItems: 0
  };

  loans: AdminLoan[] = [];
  inventory: EquipmentInventory[] = [];
  usersList: AdminUser[] = [];

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
            status: r.status as any
          };
        });
        this.calculateStats();
      }
    });

    // 2. Cargar Inventario de Equipos
    this.loadInventory();

    // 3. Cargar Usuarios
    this.loadUsers();
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

  setTab(tab: 'loans' | 'inventory' | 'users') {
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
}
