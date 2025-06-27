import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { validarEmail } from '../../utils/validations';
import { ToastController } from '@ionic/angular';


import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController

  ) { }

  /**
   * @function login
   * @description esta función utiliza el servicio de autenticación 'authService' para autenticar al usuario con su correo y contraseña, dependiendiendo del resultado de la autenticación es redirigidio a otra página o muestra un mensaje de error. Tambien valida el formato del mail.
   */
  async onLogin() {
    if (!validarEmail(this.email)) {
      this.presentToast('Por favor, ingrese un email válido');
      return;
    }

    try {
      await this.authService.logIn(this.email, this.password);

      // Obtener UID actual
      const uid = await this.authService.obtenerUid();

      if (!uid) {
        this.presentToast('No se pudo obtener el UID del usuario');
        return;
      }

      // Obtener datos del usuario
      const userData = await this.authService.getUserDataByUid(uid);

      if (!userData) {
        this.presentToast('No se encontró información del usuario');
        return;
      }

      // Redirigir según rol
      if (userData.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }

    } catch (error) {
      console.error('Error logging in:', error);
      this.presentToast('Error al iniciar sesión, revise los datos ingresados');
    }
  }




  /**
   * @function loginGoogle
   * @description esta función utiliza el servicio de autenticación 'authService' para autenticar al usuario a través de una cuenta de Google, 
   * dependiendiendo del resultado de la autenticación es redirigidio a otra página o muestra un mensaje de error.
   */
  async loginGoogle() {
    try {
      await this.authService.loginGoogle();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error logging in with Google:', error);
      this.presentToast('Ha ocurrido un error, intente nuevamente');
    }
  }


  /**
   * @function presentToast
   * @param mensage  tipo string, recibe el mensaje a mostrar en pantalla
   * @description crea y muestra en pantalla una advertencia
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
  }

}