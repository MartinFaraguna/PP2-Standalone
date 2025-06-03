import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ticket } from 'src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private collectionName = "Ticket";

  constructor(private firestore: Firestore) { }

  //crear nuevo ticket
  async createTicket(ticket: Ticket):Promise<void> {

    const ticketCollection = collection(this.firestore, this.collectionName);

    await addDoc(ticketCollection, ticket)
      .then(() => {
        console.log("Ticket creado con éxito");
      })
      .catch((error) => {
        console.error("Error al crear el ticket: ", error);
      });
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

  async deleteTicket(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(itemDoc);
  } 
}
