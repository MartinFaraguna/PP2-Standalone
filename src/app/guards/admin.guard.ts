import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (user) {
      const role = await this.authService.getUserRole(user.uid);
      if (role === 'admin') {
        return true;
      } else {
        await this.presentAlert('Acceso denegado', 'Debes ser administrador para acceder.');
        this.router.navigate(['/home']);
        return false;
      }
    } else {
      await this.presentAlert('Autenticación requerida', 'Necesitas iniciar sesión.');
      this.router.navigate(['/login']);
      return false;
    }
  }

  private getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }

  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
