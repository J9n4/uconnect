import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para el input del mensaje
import { LucideAngularModule, Search, Send, User } from 'lucide-angular';

@Component({
  selector: 'app-message-center',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './message-center.component.html',
  styleUrl: './message-center.component.css'
})
export class MessageCenterComponent implements OnInit {
  // Iconos
  readonly SearchIcon = Search;
  readonly SendIcon = Send;
  readonly UserIcon = User;

  currentUserRole = 'STUDENT'; // Lo leeremos del localStorage
  newMessage = '';

  // Lista de chats simulada
  chats = [
    { id: 1, name: 'Prof. Osvaldo Baeza', role: 'Docente FIN', lastMessage: 'Nos vemos en el laboratorio.', unread: 2, active: true },
    { id: 2, name: 'Soporte TI', role: 'Administración', lastMessage: 'Tu clave ha sido reseteada.', unread: 0, active: false },
    { id: 3, name: 'Prof. María González', role: 'Docente', lastMessage: 'Revisé tu avance del proyecto.', unread: 0, active: false }
  ];

  // Chat activo simulado
  activeChat = {
    name: 'Prof. Osvaldo Baeza',
    role: 'Docente FIN',
    messages: [
      { sender: 'me', text: 'Profesor, ¿el laboratorio 3 estará abierto hoy en la tarde?', time: '10:30 AM' },
      { sender: 'them', text: 'Hola Juan. Sí, a partir de las 15:00 hrs.', time: '11:15 AM' },
      { sender: 'them', text: 'Nos vemos en el laboratorio.', time: '11:16 AM' }
    ]
  };

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.currentUserRole = localStorage.getItem('uconnect_role') || 'STUDENT';
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.activeChat.messages.push({
        sender: 'me',
        text: this.newMessage,
        time: 'Ahora'
      });
      this.newMessage = ''; // Limpiamos el input
    }
  }

  selectChat(chatId: number) {
    this.chats.forEach(c => c.active = false);
    const selected = this.chats.find(c => c.id === chatId);
    if (selected) selected.active = true;
    // Aquí en el futuro cargaríamos los mensajes reales de la base de datos
  }
}