import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { Ticket, NewTicket } from 'src/models/user.model';
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
  tickets: Ticket[] = []; // Lista de tickets a mostrar
  currentUserUid: string | null = null; // UID del usuario actual
  isAdmin = false; // Bandera que indica si el usuario es administrador

  ticketForm!: FormGroup; // Formulario reactivo para nuevo ticket

  constructor(
    private fb: FormBuilder,
    private databaseSvc: DatabaseService,
    private authService: AuthenticationService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    // Inicializa el formulario con validaciones
    this.ticketForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      descripcion: ['', Validators.required],
    });

    // Obtiene el UID del usuario actual
    this.currentUserUid = await this.authService.obtenerUid();

    if (this.currentUserUid) {
      // Obtiene información del usuario y verifica si es admin
      const userData = await this.authService.getUserDataByUid(this.currentUserUid);
      this.isAdmin = userData?.role === 'admin';
      // Carga los tickets filtrando según rol
      this.loadTickets(this.isAdmin);
    }
  }

  private loadTickets(verTodos: boolean) {
    this.databaseSvc.getTickets().subscribe((data: Ticket[]) => {
      // Filtra los tickets: todos si es admin, propios si no
      this.tickets = data.filter(ticket => verTodos || ticket.userId === this.currentUserUid);
    });
  }

  async submitTicket() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      // Si no hay usuario autenticado, muestra mensaje
      return this.presentToast('No hay usuario autenticado');
    }

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched(); // Marca campos como tocados para mostrar errores
      return;
    }

    const formValue = this.ticketForm.value;

    // Crea un nuevo objeto tipo NewTicket con los datos del formulario
    const nuevoTicket: NewTicket = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      usuario: currentUser.email ?? '',
      telefono: Number(formValue.telefono),
      descripcion: formValue.descripcion,
      estado: 'abierto',
      created_at: serverTimestamp(),
      userId: currentUser.uid,
    };

    try {
      // Guarda el ticket y da feedback visual
      await this.databaseSvc.createTicket(nuevoTicket);
      this.ticketForm.reset();
      this.presentToast('Ticket enviado correctamente');
      this.loadTickets(this.isAdmin); // Recarga lista
    } catch (error) {
      console.error('Error al enviar ticket:', error);
      this.presentToast('Error al enviar el ticket');
    }
  }

  delete(ticketId: string) {
    // Elimina ticket por ID y recarga lista
    this.databaseSvc.deleteTicket(ticketId).then(() => {
      console.log('Ticket eliminado exitosamente');
      this.loadTickets(this.isAdmin);
    });
  }

  private async presentToast(msg: string) {
    // Muestra un toast con mensaje y estilo
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }
}