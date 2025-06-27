import { Component, OnInit } from '@angular/core'; 
// Importa los decoradores y ciclo de vida OnInit de Angular
import { CommonModule } from '@angular/common';
// Importa funcionalidades comunes de Angular como *ngFor, *ngIf
import { IonicModule, ToastController } from '@ionic/angular';
// Importa componentes de Ionic y el controlador para mostrar notificaciones tipo toast
import { FormsModule } from '@angular/forms';
// Importa el módulo para formularios en Angular (template-driven)
import { DatabaseService } from 'src/app/services/database.service';
// Servicio personalizado para interactuar con la base de datos (FireStore u otro)
import { Ticket, EstadoTicket } from 'src/models/user.model';
// Importa interfaces o tipos para tickets y estados desde el modelo de usuario
import { Timestamp } from 'firebase/firestore';
// Importa Timestamp de Firestore para manejar fechas específica
import { AlertController } from '@ionic/angular';

import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

// Interfaz que extiende Ticket pero redefine 'created_at' como Timestamp para manejo interno
interface RawTicket extends Omit<Ticket, 'created_at'> {
  created_at: Timestamp;
}

@Component({
  selector: 'app-admin',
  standalone: true, 
  // Indica que es un componente standalone sin necesidad de NgModule
  imports: [IonicModule, CommonModule, FormsModule],
  // Importa módulos necesarios para que funcione el componente
  templateUrl: './admin.page.html',
  // Ruta al archivo HTML del componente
  styleUrls: ['./admin.page.scss'],
  // Ruta al archivo de estilos del componente
})
export class AdminPage implements OnInit {
  showTextarea = false;  // controla visibilidad del textarea
  comentario: string = '';  // guarda el texto escrito
  tickets: Ticket[] = [];
  // Arreglo para almacenar los tickets que se cargan desde la base de datos

  constructor(
    private dbService: DatabaseService,
    // Inyecta el servicio para manejar datos
    private toastCtrl: ToastController,
    // Inyecta el controlador para mostrar mensajes toast
    private router: Router,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.loadTickets();
    // Cuando el componente se inicializa, carga los tickets
  }

  loadTickets() {
    // Método para suscribirse a los datos de tickets del servicio
    this.dbService.getTickets().subscribe((data: Ticket[]) => {
      this.tickets = data;
      // Actualiza el arreglo local con los tickets recibidos
    });
  }

  async changeEstado(ticket: Ticket, nuevoEstado: EstadoTicket) {
    // Método para actualizar el estado de un ticket específico
    try {
      await this.dbService.updateTicket(ticket.id, { estado: nuevoEstado });
      // Llama al servicio para actualizar el estado en la base de datos
      this.showToast('Estado actualizado ');
      // Muestra mensaje de éxito
    } catch (err) {
      console.error(err);
      // Imprime error en consola si falla
      this.showToast('Error al actualizar ');
      // Muestra mensaje de error al usuario
    }
  }

  async abrirComentario(ticket: Ticket) {
  const alert = await this.alert.create({
    header: 'Dejar comentario',
    inputs: [
      {
        name: 'comentario',
        type: 'textarea',
        placeholder: 'Escriba su comentario aquí'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Guardar',
        handler: async (data) => {
          const comentario = data.comentario?.trim();
          if (comentario) {
            try {
              await this.dbService.updateTicket(ticket.id, { comentario_resolutor: comentario });
              this.showToast('Comentario guardado');
            } catch (err) {
              console.error(err);
              this.showToast('Error al guardar comentario');
            }
          } else {
            this.showToast('Comentario vacío');
          }
        }
      }
    ]
  });

  await alert.present();
}

  async eliminar(ticketId: string) {
    // Método para eliminar un ticket dado su ID
    try {
      await this.dbService.deleteTicket(ticketId);
      // Llama al servicio para eliminar el ticket en la base de datos
      this.showToast('Ticket eliminado ');
      // Mensaje de confirmación
    } catch (err) {
      console.error(err);
      this.showToast('Error al eliminar');
      // Mensaje de error si no pudo eliminar
    }
  }

  private async showToast(message: string) {
    // Método privado para mostrar mensajes toast en pantalla
    const toast = await this.toastCtrl.create({
      message,         // Mensaje que se mostrará
      duration: 2000,  // Duración en milisegundos (2 segundos)
      position: 'bottom', // Posición del toast en pantalla
    });
    toast.present();
    // Presenta el toast al usuario
  }
  async logout() {
  try {
    await signOut(getAuth());
    this.router.navigate(['/login']);
    this.showToast('Sesión cerrada correctamente');
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
    this.showToast('Error al cerrar sesión');
  }
}
}
