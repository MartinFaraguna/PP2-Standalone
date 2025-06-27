
import { Timestamp, FieldValue } from 'firebase/firestore';

// Tipo literal reutilizable
export type EstadoTicket = 'abierto' | 'cerrado' | 'en progreso';

//  Modelo completo de ticket obtenido desde Firestore
export interface Ticket {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  telefono: number;
  descripcion: string;
  estado: EstadoTicket;
  created_at: Date;
  userId: string;
  comentario_resolutor: string;
}

//  Modelo usado para crear un ticket nuevo
export interface NewTicket extends Omit<Ticket, 'id' | 'created_at'> {
  created_at: FieldValue;
}

// Modelo de usuario
export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}
