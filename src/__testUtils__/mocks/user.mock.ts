import { User } from "@/types";

export const mockUser: User = {
  id: 7,
  username: "analista1",
  email: "analista@unl.edu.ec",
  provider: "local",
  confirmed: true,
  blocked: false,
  role: {
    id: 1,
    name: "Analista",
    description: "Usuario con rol analista",
    type: "analyst",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  proyectos: [],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};
