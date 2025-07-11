import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { validarEmail, validarPassword } from '../../utils/validations';

import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage implements OnInit {

  email: string = '';
  password: string = '';


  constructor(    
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController
) { }


/**
 * @function onRegister 
 * @description esta función permite que el usuario pueda registrarse en la aplicación por medio de un mail y contraseña.
 */
async onRegister() {
  if (!validarEmail(this.email)) {
    this.presentToast('Por favor, ingrese un email válido');
    return;
  }

  if (!validarPassword(this.password)) {
    this.presentToast('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un signo especial');
    return;
  }

  try {
    await this.authService.signUp(this.email, this.password);
    this.router.navigate(['/home']);
    this.presentToast('Registro exitoso');
  } catch (error: any) {
    console.error('Error al registrar:', error);
    this.presentToast('Error al registrar: ' + error.message);
  }
}

/**
 * @function presentToast
 * @param mensage  tipo string, recibe el mensaje a mostrar en pantalla
 * @description crea y muestra en pantalla una advertencia 
 */
async presentToast(message: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

  ngOnInit() {
  }

}