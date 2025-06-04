import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Ticket } from 'src/models/user.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class HomePage implements OnInit {
  ticket: Ticket[] = [];

  constructor(private databaseSvc: DatabaseService) {

    this.databaseSvc.getTickets().subscribe((data) => {
      this.ticket = data;
      console.log('Tickets obtenidos:', this.ticket);
    })
  }

  add() {
    this.databaseSvc.getTickets().subscribe((data) => {
      this.ticket = data;
      console.log('Tickets obtenidos:', this.ticket);
    })
    this.databaseSvc
      .createTicket({
        id: 0, // Asignar un ID único basado en la longitud del array
        nombre: 'Nuevo',
        apellido: 'Usuario',
        usuario: 'nuevoUsuario',
        telefono: 123456789,
        descripcion: 'Descripción del nuevo ticket',
        estado: 'abierto',
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
  
  ngOnInit() {}
}
