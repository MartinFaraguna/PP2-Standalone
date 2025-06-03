export interface User { 
  uid: string;
  email: string;
  password: string;
  name: string;
}

export interface Ticket {
  nombre: string;
  apellido: string;
  usuario: string;
  telefono: number;
  descripcion: string;
}