import { Timestamp } from "firebase/firestore";
import { FieldValue } from "firebase/firestore/lite";

export interface User { 
  uid: string;
  email: string;
  role: string;
  password: string;
  name: string;
}

export interface Ticket {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  telefono: number;
  descripcion: string;
  estado: 'abierto' | 'cerrado' | 'en progreso';
  created_at: Timestamp | FieldValue;
  userId: string;
}