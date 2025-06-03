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
    })
  }

  add() {
    this.databaseSvc
      .createTicket({
        nombre: 'Nuevo',
        apellido: 'Usuario',
        usuario: 'nuevoUsuario',
        telefono: 123456789,
        descripcion: 'Descripción del nuevo ticket',
      })
      .then((data) => {
        console.log('Ticket agregado exitosamente: ' + data);
      })
      .catch((error) => {
        console.error('Error al agregar el ticket:', error);
      });
  }
  ngOnInit() {}
}
