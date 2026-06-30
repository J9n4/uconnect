import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

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
  dbId: number;
  name: string;
  lab: string;
  date: string;
  status: 'Pendiente' | 'Aprobado' | 'Entregado' | 'Devuelto' | 'Cancelado';
  statusClass: 'pending' | 'approved' | 'delivered' | 'returned' | 'cancelled';
  studentName?: string;
  studentId?: number;
  equipmentId?: number;
  observaciones?: string;
}

export interface TutorAppointment {
  id: string;
  dbId: number;
  teacher: string;
  subject: string;
  day: string;
  startHour: number;
  duration: number;
  modality: 'Presencial' | 'Online';
  room: string;
  studentName: string;
  status: 'Pendiente' | 'Aceptada' | 'Reagendada' | 'Cancelada';
}

export interface ChatMessage {
  sender: 'me' | 'them' | 'system';
  text: string;
  time: string;
}

export interface Chat {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  messages: ChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'http://localhost:8000/api';

  // Clases generales (Fijas para el mockup de horario de clases)
  private classesSubject = new BehaviorSubject<ClassSchedule[]>([
    { id: 1, name: 'Desarrollo Frontend', day: 'Lunes', startHour: 8, duration: 2, room: 'Lab 3', type: 'lab' },
    { id: 2, name: 'Bases de Datos', day: 'Martes', startHour: 10, duration: 2, room: 'Sala 402', type: 'theory' },
    { id: 3, name: 'Ingeniería de Software', day: 'Miércoles', startHour: 14, duration: 3, room: 'Sala 105', type: 'theory' },
    { id: 4, name: 'Desarrollo Frontend', day: 'Jueves', startHour: 9, duration: 2, room: 'Lab 3', type: 'lab' },
    { id: 5, name: 'Taller de Emprendimiento', day: 'Viernes', startHour: 11, duration: 2, room: 'Auditorio', type: 'workshop' }
  ]);

  // Préstamos de equipos
  private equipmentRequestsSubject = new BehaviorSubject<EquipmentRequest[]>([]);
  // Solicitudes de Tutorías
  private tutorAppointmentsSubject = new BehaviorSubject<TutorAppointment[]>([]);

  private normalizeRole(r: string): 'STUDENT' | 'TEACHER' | 'ADMIN' {
    if (!r) return 'STUDENT';
    const upper = r.toUpperCase();
    if (['TEACHER', 'PROFESOR', 'DOCENTE'].includes(upper)) return 'TEACHER';
    if (['ADMIN', 'ADMINISTRADOR'].includes(upper)) return 'ADMIN';
    return 'STUDENT';
  }

  private createEmptyChat(u: any): Chat {
    const norm = this.normalizeRole(u.rol);
    return {
      id: u.id_usuario,
      name: `${u.nombre} ${u.apellido}`,
      role: norm === 'ADMIN' ? 'Administrador' : (norm === 'TEACHER' ? 'Profesor' : 'Estudiante'),
      avatar: norm === 'ADMIN' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' : 
              (norm === 'TEACHER' ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' : 
               'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
      lastMessage: '',
      unread: 0,
      messages: []
    };
  }

  loadMessagesFromApi() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    let rolesQuery = '';
    if (user.role === 'STUDENT') {
      rolesQuery = '?roles=TEACHER,PROFESOR,DOCENTE,ADMIN,ADMINISTRADOR';
    } else if (user.role === 'TEACHER') {
      rolesQuery = '?roles=STUDENT,ESTUDIANTE,USUARIO';
    }

    forkJoin({
      usuarios: this.http.get<any[]>(`${this.baseUrl}/usuarios${rolesQuery}`),
      mensajes: this.http.get<any[]>(`${this.baseUrl}/mensajes?usuario_id=${user.id}`)
    }).subscribe({
      next: ({ usuarios, mensajes }) => {
        const chatsMap = new Map<number, Chat>();
        
        usuarios.forEach(u => {
          if (u.id_usuario === user.id) return;
          const uRole = this.normalizeRole(u.rol);
          if (user.role === 'STUDENT' && uRole !== 'STUDENT') {
            chatsMap.set(u.id_usuario, this.createEmptyChat(u));
          } else if (user.role === 'TEACHER' && uRole === 'STUDENT') {
            chatsMap.set(u.id_usuario, this.createEmptyChat(u));
          } else if (user.role === 'ADMIN') {
            chatsMap.set(u.id_usuario, this.createEmptyChat(u));
          }
        });

        mensajes.sort((a, b) => new Date(a.fecha_envio).getTime() - new Date(b.fecha_envio).getTime()).forEach(m => {
          const isSender = m.id_emisor === user.id;
          const isReceiver = m.id_receptor === user.id;
          
          if (!isSender && !isReceiver) return; 

          const otherUserId = isSender ? m.id_receptor : m.id_emisor;
          
          if (!chatsMap.has(otherUserId)) {
            const otherUser = usuarios.find(u => u.id_usuario === otherUserId);
            if (otherUser) {
              chatsMap.set(otherUserId, this.createEmptyChat(otherUser));
            }
          }

          const chat = chatsMap.get(otherUserId);
          if (chat) {
            chat.messages.push({
              sender: isSender ? 'me' : 'them',
              text: m.contenido,
              time: new Date(m.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            });
            chat.lastMessage = m.contenido;
            // Contar mensajes no leídos recibidos por el usuario actual
            if (!isSender && !m.leido) {
              chat.unread += 1;
            }
          }
        });

        this.chatsSubject.next(Array.from(chatsMap.values()));
      }
    });
  }

  // Chats dinámicos
  private chatsSubject = new BehaviorSubject<Chat[]>([]);

  classes$ = this.classesSubject.asObservable();
  equipmentRequests$ = this.equipmentRequestsSubject.asObservable();
  tutorAppointments$ = this.tutorAppointmentsSubject.asObservable();
  chats$ = this.chatsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  loadInitialData() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // 1. Cargar préstamos desde el backend
    this.http.get<any[]>(`${this.baseUrl}/prestamos`).subscribe({
      next: (prestamos) => {
        const mapped = prestamos.map(p => {
          return {
            id: `REQ-${p.id_prestamo}`,
            dbId: p.id_prestamo,
            name: p.equipo ? p.equipo.nombre : `Equipo #${p.id_equipo}`,
            lab: p.equipo ? p.equipo.ubicacion : 'Almacén Central',
            date: new Date(p.fecha_solicitud).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: p.estado as any,
            statusClass: (p.estado === 'Aprobado' ? 'approved' : 
                         (p.estado === 'Entregado' ? 'delivered' : 
                          (p.estado === 'Devuelto' ? 'returned' : 'pending'))) as any,
            studentName: p.estudiante && p.estudiante.usuario ? 
                         `${p.estudiante.usuario.nombre} ${p.estudiante.usuario.apellido}` : 'Carlos Martínez',
            studentId: p.id_estudiante,
            equipmentId: p.id_equipo,
            observaciones: p.observaciones
          };
        });
        this.equipmentRequestsSubject.next(mapped);
      }
    });

    // 2. Cargar citas desde el backend
    this.http.get<any[]>(`${this.baseUrl}/horarios-atencion`).subscribe({
      next: (horarios) => {
        const appointments = horarios
          .filter(h => h.id_estudiante !== null)
          .map(h => {
            return {
              id: `APT-${h.id_horario}`,
              dbId: h.id_horario,
              teacher: h.profesor && h.profesor.usuario ? 
                       `Dr. ${h.profesor.usuario.nombre} ${h.profesor.usuario.apellido}` : 'Dr. Miguel Ángel Torres',
              subject: h.profesor ? h.profesor.departamento : 'Programación Orientada a Objetos',
              day: h.dia_semana,
              startHour: parseInt(h.hora_inicio.split(':')[0]) || 10,
              duration: 1,
              modality: h.modalidad,
              room: h.ubicacion,
              studentName: h.estudiante && h.estudiante.usuario ? 
                           `${h.estudiante.usuario.nombre} ${h.estudiante.usuario.apellido}` : 'Carlos Martínez',
              status: (h.estado === 'Reservado' ? 'Pendiente' : 
                      (h.estado === 'Aceptado' ? 'Aceptada' : 'Cancelada')) as any
            };
          });
        this.tutorAppointmentsSubject.next(appointments);
      }
    });

    this.loadMessagesFromApi();
  }

  // --- MÉTODOS DE CHAT ---
  sendMessage(chatId: number, text: string, sender: 'me' | 'them' | 'system' = 'me') {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const chats = this.chatsSubject.getValue();
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      chat.messages.push({ sender, text, time: timeStr });
      chat.lastMessage = text;

      this.chatsSubject.next([...chats]);

      if (sender === 'me') {
        const payload = {
          id_emisor: user.id,
          id_receptor: chatId,
          contenido: text,
          fecha_envio: new Date().toISOString(),
          leido: false
        };
        this.http.post(`${this.baseUrl}/mensajes`, payload).subscribe({
          error: (err) => console.error('Error enviando mensaje', err)
        });
      }
    }
  }

  sendSystemNotification(studentName: string, text: string) {
    const chats = this.chatsSubject.getValue();
    const studentChat = chats.find(c => c.name === studentName);
    if (studentChat) {
      studentChat.messages.push({ sender: 'system', text, time: 'Ahora' });
      studentChat.lastMessage = text;
    }
    this.chatsSubject.next([...chats]);
  }

  // --- GESTIÓN DE EQUIPOS (CONSUMIENDO API) ---
  getEquipments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/equipos`);
  }

  // --- NOTIFICACIONES (CONSUMIENDO API) ---
  getNotifications(): Observable<any[]> {
    const user = this.authService.getCurrentUser();
    return this.http.get<any[]>(`${this.baseUrl}/notificaciones`).pipe(
      map(notifs => user ? notifs.filter(n => n.id_usuario === user.id) : notifs)
    );
  }

  requestEquipment(equipmentId: number, studentId: number): Observable<any> {
    const payload = {
      id_estudiante: studentId,
      id_equipo: equipmentId,
      fecha_solicitud: new Date().toISOString(),
      estado: 'Pendiente',
      observaciones: 'Solicitado desde la plataforma web'
    };
    return this.http.post(`${this.baseUrl}/prestamos`, payload).pipe(
      tap(() => this.loadInitialData())
    );
  }

  cancelEquipment(id: string) {
    const dbId = id.replace('REQ-', '');
    this.http.delete(`${this.baseUrl}/prestamos/${dbId}`).subscribe(() => {
      this.loadInitialData();
    });
  }

  deleteEquipmentRequest(id: string): Observable<any> {
    const dbId = id.replace('REQ-', '');
    return this.http.delete(`${this.baseUrl}/prestamos/${dbId}`).pipe(
      tap(() => this.loadInitialData())
    );
  }

  updateEquipmentRequest(id: string, data: any): Observable<any> {
    const dbId = id.replace('REQ-', '');
    return this.http.put(`${this.baseUrl}/prestamos/${dbId}`, data).pipe(
      tap(() => this.loadInitialData())
    );
  }

  approveEquipmentRequest(id: string) {
    const dbId = id.replace('REQ-', '');
    this.http.put(`${this.baseUrl}/prestamos/${dbId}`, { estado: 'Aprobado' }).subscribe(() => {
      this.loadInitialData();
      
      const req = this.equipmentRequestsSubject.getValue().find(r => r.id === id);
      if (req) {
        this.sendSystemNotification(
          req.studentName || 'Carlos Martínez',
          `Sistema: Tu solicitud del equipo "${req.name}" ha sido Aprobada. Ya puedes retirarlo.`
        );
      }
    });
  }

  deliverEquipmentRequest(id: string) {
    const dbId = id.replace('REQ-', '');
    this.http.put(`${this.baseUrl}/prestamos/${dbId}`, { 
      estado: 'Entregado', 
      fecha_prestamo: new Date().toISOString() 
    }).subscribe(() => {
      this.loadInitialData();

      const req = this.equipmentRequestsSubject.getValue().find(r => r.id === id);
      if (req) {
        this.sendSystemNotification(
          req.studentName || 'Carlos Martínez',
          `Sistema: El préstamo de tu equipo "${req.name}" ha sido Entregado físicamente.`
        );
      }
    });
  }

  returnEquipmentRequest(id: string) {
    const dbId = id.replace('REQ-', '');
    this.http.put(`${this.baseUrl}/prestamos/${dbId}`, { 
      estado: 'Devuelto', 
      fecha_devolucion_real: new Date().toISOString() 
    }).subscribe(() => {
      this.loadInitialData();

      const req = this.equipmentRequestsSubject.getValue().find(r => r.id === id);
      if (req) {
        this.sendSystemNotification(
          req.studentName || 'Carlos Martínez',
          `Sistema: El equipo "${req.name}" ha sido Devuelto y verificado con éxito.`
        );
      }
    });
  }

  // --- CRUD DE EQUIPOS (ADMIN - RF-14) ---
  addEquipment(name: string, description: string, location: string): Observable<any> {
    const payload = {
      nombre: name,
      descripcion: description,
      estado: 'Disponible',
      ubicacion: location,
      fecha_alta: new Date().toISOString()
    };
    return this.http.post(`${this.baseUrl}/equipos`, payload).pipe(
      tap(() => this.loadInitialData())
    );
  }

  updateEquipment(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/equipos/${id}`, payload).pipe(
      tap(() => this.loadInitialData())
    );
  }

  deleteEquipment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/equipos/${id}`).pipe(
      tap(() => this.loadInitialData())
    );
  }

  // --- GESTIÓN DE TUTORÍAS (CONSUMIENDO API) ---
  getAttentionHours(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/horarios-atencion`);
  }

  scheduleAppointment(horarioId: number, studentId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/horarios-atencion/${horarioId}`, {
      id_estudiante: studentId,
      estado: 'Reservado'
    }).pipe(
      tap(() => this.loadInitialData())
    );
  }

  cancelAppointment(id: string) {
    const dbId = id.replace('APT-', '');
    this.http.put(`${this.baseUrl}/horarios-atencion/${dbId}`, {
      id_estudiante: null,
      estado: 'Disponible'
    }).subscribe(() => {
      this.loadInitialData();
    });
  }

  acceptTutorAppointment(id: string) {
    const dbId = id.replace('APT-', '');
    this.http.put(`${this.baseUrl}/horarios-atencion/${dbId}`, {
      estado: 'Aceptado'
    }).subscribe(() => {
      this.loadInitialData();

      const apt = this.tutorAppointmentsSubject.getValue().find(a => a.id === id);
      if (apt) {
        this.sendSystemNotification(
          apt.studentName,
          `Sistema: Tu solicitud de tutoría para "${apt.subject}" el día ${apt.day} a las ${apt.startHour}:00 hrs ha sido Aceptada por el docente.`
        );
      }
    });
  }

  rejectTutorAppointment(id: string) {
    const dbId = id.replace('APT-', '');
    this.http.put(`${this.baseUrl}/horarios-atencion/${dbId}`, {
      id_estudiante: null,
      estado: 'Disponible'
    }).subscribe(() => {
      this.loadInitialData();

      const apt = this.tutorAppointmentsSubject.getValue().find(a => a.id === id);
      if (apt) {
        this.sendSystemNotification(
          apt.studentName,
          `Sistema: Tu solicitud de tutoría para "${apt.subject}" ha sido Rechazada/Cancelada por el docente.`
        );
      }
    });
  }

  rescheduleTutorAppointment(id: string, day: string, startHour: number, room: string, modality: 'Presencial' | 'Online') {
    const dbId = id.replace('APT-', '');
    this.http.put(`${this.baseUrl}/horarios-atencion/${dbId}`, {
      dia_semana: day,
      hora_inicio: `${startHour}:00`,
      hora_fin: `${startHour + 1}:00`,
      ubicacion: room,
      modalidad: modality,
      estado: 'Reservado'
    }).subscribe(() => {
      this.loadInitialData();

      const apt = this.tutorAppointmentsSubject.getValue().find(a => a.id === id);
      if (apt) {
        this.sendSystemNotification(
          apt.studentName,
          `Sistema: Tu tutoría de "${apt.subject}" ha sido Reagendada. Nuevo horario: ${day} a las ${startHour}:00 hrs en "${room}" (${modality}).`
        );
      }
    });
  }
}
