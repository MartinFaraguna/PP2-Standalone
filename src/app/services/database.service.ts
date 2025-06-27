import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  updateDoc,
  DocumentReference,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Ticket, NewTicket } from 'src/models/user.model';

interface RawTicket extends Omit<Ticket, 'created_at'> {
  created_at: Timestamp;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private collectionName = 'Ticket';

  constructor(private firestore: Firestore) {}

  async createTicket(ticket: NewTicket): Promise<DocumentReference> {
    const ticketCollection = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(ticketCollection, ticket);
    return docRef;
  }

  getItemById(id: string): Observable<Ticket> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(itemDoc, { idField: 'id' }).pipe(
      map((raw: any) => ({
        ...raw,
        created_at: raw.created_at.toDate()
      }))
    ) as Observable<Ticket>;
  }

  getTickets(): Observable<Ticket[]> {
    const ticketCollection = collection(this.firestore, this.collectionName);
    return collectionData(ticketCollection, { idField: 'id' }).pipe(
      map((rawList: any[]) =>
        rawList.map(ticket => ({
          ...ticket,
          created_at: ticket.created_at.toDate()
        }))
      )
    );
  }

  async updateTicket(id: string, ticket: Partial<NewTicket>): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(itemDoc, ticket);
  }

  async deleteTicket(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(itemDoc);
  }
}
