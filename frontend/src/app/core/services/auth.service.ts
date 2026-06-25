import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  roleLabel: string;
  avatar: string;
  specialty: string;
  biography?: string;
  departamento?: string;
  titulo?: string;
  cargo?: string;
  matricula?: string;
  carrera?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/usuarios';

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  private getStoredUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('uconnect_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(email: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const found = users.find(u => u.correo.toLowerCase() === email.toLowerCase());
        if (found) {
          const profile: UserProfile = {
            id: found.id_usuario,
            name: `${found.nombre} ${found.apellido}`,
            email: found.correo,
            role: found.rol as 'STUDENT' | 'TEACHER' | 'ADMIN',
            roleLabel: found.rol === 'ADMIN' ? 'Administrador' : (found.rol === 'TEACHER' ? 'Profesor' : 'Estudiante'),
            avatar: found.rol === 'ADMIN' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' : 
                    (found.rol === 'TEACHER' ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' : 
                     'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
            specialty: found.rol === 'ADMIN' ? 'TI & Servicios' : 
                       (found.rol === 'TEACHER' ? 'Programación Orientada a Objetos' : 'Ingeniería Informática')
          };
          
          localStorage.setItem('uconnect_user', JSON.stringify(profile));
          localStorage.setItem('uconnect_role', profile.role);
          localStorage.setItem('uconnect_user_email', profile.email);
          this.currentUserSubject.next(profile);
          return true;
        }
        return false;
      })
    );
  }

  updateProfile(profileData: any): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of(null);

    // Separar campos del modelo Usuario
    const userPayload = {
      nombre: profileData.name.split(' ')[0] || currentUser.name.split(' ')[0],
      apellido: profileData.name.split(' ').slice(1).join(' ') || currentUser.name.split(' ').slice(1).join(' '),
      correo: currentUser.email,
    };

    return this.http.put(`${this.apiUrl}/${currentUser.id}`, userPayload).pipe(
      map((updatedUser: any) => {
        const newProfile = {
          ...currentUser,
          name: `${updatedUser.nombre} ${updatedUser.apellido}`,
          biography: profileData.biography || currentUser.biography
        };
        localStorage.setItem('uconnect_user', JSON.stringify(newProfile));
        this.currentUserSubject.next(newProfile);
        return newProfile;
      })
    );
  }

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('uconnect_user');
    localStorage.removeItem('uconnect_role');
    localStorage.removeItem('uconnect_user_email');
    this.currentUserSubject.next(null);
  }
}
