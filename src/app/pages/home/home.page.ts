import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ticket } from 'src/models/user.model';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class HomePage implements OnInit {
  ticket: Ticket[] = [];
  currentUserUid: string | null = null;


  constructor(
    private databaseSvc: DatabaseService,
    private authService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.currentUserUid = await this.authService.obtenerUid();

    if (this.currentUserUid) {
      this.loadTickets();
    }
  }

  private loadTickets() {
    this.databaseSvc.getTickets().subscribe((data) => {
      this.ticket = data
        .filter(ticket => ticket.userId === this.currentUserUid)
        .map(ticket => ({
          ...ticket,
          created_at: (ticket.created_at as any)?.toDate?.() ?? null
        }));
    });
  }

  add() {

  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error('No hay usuario autenticado');
    return;
  }

    this.databaseSvc.getTickets().subscribe((data) => {
      this.ticket = data;
      console.log('Tickets obtenidos:', this.ticket);
    })
    this.databaseSvc
      .createTicket({
        id: 0, // Asignar un ID único basado en la longitud del array
        nombre: 'Nuevo',
        apellido: 'Usuario',
        usuario: currentUser.email,
        telefono: 123456789,
        descripcion: 'Descripción del nuevo ticket',
        estado: 'abierto',
        created_at: serverTimestamp(),
        userId: currentUser.uid,
      })
      .then((data) => {
        console.log('Ticket agregado exitosamente:');
      })
      .catch((error) => {
        console.error('Error al agregar el ticket:', error);
      });
  }

  delete(ticketId: number) {
    this.databaseSvc.deleteTicket(ticketId).then(() => {
      console.log('Ticket eliminado exitosamente' + ticketId);
    })
  }
  
}
