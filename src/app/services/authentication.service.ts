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
import { User } from 'src/models/user.model';

import { Firestore, doc, getDoc ,setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);


  async signUp(email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = credential.user.uid;

    const userData = {
      uid,
      email,
      name: '',
      role: 'user'
    };

    // Guarda en Firestore (colección 'users', documento con el UID)
    await setDoc(doc(this.firestore, 'users', uid), userData);
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

  async getUserDataByUid(uid: string): Promise<User | null> {
  const userDocRef = doc(this.firestore, 'users', uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  } else {
    return null;
  }
}
  
}
