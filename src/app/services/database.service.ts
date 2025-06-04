import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ticket } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private collectionName = 'Ticket';
  private counter = 'counters/tickets';

  constructor(private firestore: Firestore) {}

  //crear nuevo ticket
  async createTicket(ticket: Ticket): Promise<void> {
    
    const ticketCollection = collection(this.firestore, this.collectionName);

    await addDoc(ticketCollection, ticket)
      .then(() => {
        console.log('Ticket creado con éxito')
      })
      .catch((error) => {
        console.error('Error al crear el ticket: ', error);
      });
  }

  getItemById(id: string): Observable<any> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(itemDoc, { idField: 'id' });
  }
  //traer tickets
  getTickets(): Observable<any[]> {
    const ticketCollection = collection(this.firestore, this.collectionName);
    return collectionData(ticketCollection, { idField: 'id' });
  }

  //actualizar ticket
  async updateTicket(id: string, ticket: any): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(itemDoc, ticket);
  }

  async deleteTicket(id: number): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(itemDoc);
  }
}
