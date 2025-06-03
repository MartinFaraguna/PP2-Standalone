import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, getFirestore, setDoc, doc } from '@angular/fire/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { User } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  signIn(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  // Base de datos

  

}
