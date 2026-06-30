import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Send, User } from 'lucide-angular';
import { StudentDataService, Chat } from '../../../core/services/student-data.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-message-center',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './message-center.component.html',
  styleUrl: './message-center.component.css'
})
export class MessageCenterComponent implements OnInit {
  private studentDataService = inject(StudentDataService);
  private authService = inject(AuthService);

  // Iconos
  readonly SearchIcon = Search;
  readonly SendIcon = Send;
  readonly UserIcon = User;

  currentUserRole = 'STUDENT';
  newMessage = '';
  
  // Lista de chats filtrada para la vista activa
  allChatsList: Chat[] = [];
  chats: Chat[] = [];
  activeChat: Chat | null = null;
  searchTerm = '';

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserRole = currentUser?.role || 'STUDENT';

    this.studentDataService.chats$.subscribe(allChats => {
      // Filtrar chats según el rol
      if (this.currentUserRole === 'STUDENT') {
        // Alumnos ven los chats de los profesores/administradores
        this.allChatsList = allChats.filter(c => c.role !== 'Estudiante');
      } else {
        // Profesores y Administradores ven a todos
        this.allChatsList = allChats;
      }
      this.filterChats();

      // Sincronizar el chat activo si hay uno seleccionado
      if (this.activeChat) {
        const updatedActive = this.chats.find(c => c.id === this.activeChat!.id);
        if (updatedActive) {
          this.activeChat = updatedActive;
        }
      } else if (this.chats.length > 0) {
        // Seleccionar el primero por defecto
        this.selectChat(this.chats[0].id);
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.activeChat) {
      // Enviar mensaje a través del servicio global
      this.studentDataService.sendMessage(this.activeChat.id, this.newMessage, 'me');
      this.newMessage = '';
    }
  }

  selectChat(chatId: number) {
    const selected = this.chats.find(c => c.id === chatId);
    if (selected) {
      this.activeChat = selected;
      selected.unread = 0; // Marcar como leídos
    }
  }

  filterChats() {
    if (!this.searchTerm.trim()) {
      this.chats = [...this.allChatsList];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.chats = this.allChatsList.filter(c => 
        c.name.toLowerCase().includes(term) || c.role.toLowerCase().includes(term)
      );
    }
  }
}