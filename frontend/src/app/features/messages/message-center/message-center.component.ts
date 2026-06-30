import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Send, User, Plus, X } from 'lucide-angular';
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
  readonly PlusIcon = Plus;
  readonly XIcon = X;

  currentUserRole = 'STUDENT';
  newMessage = '';
  
  // Lista de chats filtrada para la vista activa
  allChatsList: Chat[] = []; // Only those with messages > 0
  allSystemContacts: Chat[] = []; // All available contacts (with or without messages)
  chats: Chat[] = [];
  activeChat: Chat | null = null;
  searchTerm = '';
  hiddenChats = new Set<number>();

  // Modal logic
  showNewChatModal = false;
  newChatSearch = '';
  filteredContacts: Chat[] = [];

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserRole = currentUser?.role || 'STUDENT';

    this.studentDataService.chats$.subscribe(allChats => {
      // Filtrar chats según el rol
      let contacts = [];
      if (this.currentUserRole === 'STUDENT') {
        // Alumnos ven los chats de los profesores/administradores
        contacts = allChats.filter(c => c.role !== 'Estudiante');
      } else {
        // Profesores y Administradores ven a todos
        contacts = allChats;
      }
      this.allSystemContacts = contacts;
      this.allChatsList = contacts.filter(c => c.messages && c.messages.length > 0);
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
    let base = this.allChatsList.filter(c => !this.hiddenChats.has(c.id));
    if (!this.searchTerm.trim()) {
      this.chats = [...base];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.chats = base.filter(c => 
        c.name.toLowerCase().includes(term) || c.role.toLowerCase().includes(term)
      );
    }
  }

  hideChat(event: Event, chatId: number) {
    event.stopPropagation();
    this.hiddenChats.add(chatId);
    if (this.activeChat?.id === chatId) {
      this.activeChat = null;
    }
    this.filterChats();
  }

  // --- NEW CHAT MODAL ---
  openNewChatModal() {
    this.showNewChatModal = true;
    this.newChatSearch = '';
    this.filterNewContacts();
  }

  closeNewChatModal() {
    this.showNewChatModal = false;
  }

  filterNewContacts() {
    if (!this.newChatSearch.trim()) {
      this.filteredContacts = [...this.allSystemContacts];
    } else {
      const term = this.newChatSearch.toLowerCase();
      this.filteredContacts = this.allSystemContacts.filter(c => 
        c.name.toLowerCase().includes(term) || c.role.toLowerCase().includes(term)
      );
    }
  }

  startNewChat(contact: Chat) {
    this.closeNewChatModal();
    
    // Si estaba oculto, lo volvemos a mostrar
    if (this.hiddenChats.has(contact.id)) {
      this.hiddenChats.delete(contact.id);
    }

    // Check if the chat is already in our history
    if (!this.allChatsList.find(c => c.id === contact.id)) {
       // Temporarily add it to the active list so we can send a message
       this.allChatsList.unshift(contact);
    }
    
    this.filterChats();
    this.selectChat(contact.id);
  }
}