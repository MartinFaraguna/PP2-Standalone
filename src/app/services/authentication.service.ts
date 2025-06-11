import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private auth: Auth = inject(Auth);

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logOut() {
    return signOut(this.auth);
  }

  loginGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async obtenerUid(): Promise<string | null> {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  async getUsuario(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      if (user.displayName) return user.displayName;
      if (user.email) return user.email.split('@')[0];
    }
    return null;
  }
}
