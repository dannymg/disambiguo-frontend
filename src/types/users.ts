// Entidades relacionadas al pluggin de USERS de Strapi, y el manejo del Auth local

import { Proyecto } from "./proyectos";

// ==============Entidades de Strapi=============
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: Role;
  proyectos?: Proyecto[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// ==============Entidad de Auth=============
export interface AuthResponse {
  jwt: string;
  user: User;
}
