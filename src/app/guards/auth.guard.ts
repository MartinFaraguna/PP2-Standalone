import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private alertController: AlertController
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (user) {
      return true;
    } else {
      await this.presentAlert();
      this.router.navigate(['/login']);
      return false;
    }
  }

  /**
   * @function getCurrentUser
   * @description Retorna la promesa del usuario actual autenticado.
   */
  private getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        unsubscribe(); // evitamos múltiples ejecuciones
        resolve(user);
      }, reject);
    });
  }

  /**
   * @function presentAlert
   * @description Muestra una alerta si el usuario no está autenticado.
   */
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Autenticación requerida',
      message: 'Necesitas iniciar sesión para acceder a esta función.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
