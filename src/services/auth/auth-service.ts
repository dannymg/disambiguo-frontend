import axiosInstance from "@/services/lib/axios";

const ROL_ANALISTA_ID = parseInt(process.env.STRAPI_ID_ROL_ANALISTA || '0', 10);

// Agregar token al header de Authorization
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obtener la información del usuario actual
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me?populate=role');
  return response.data;
};

// Verificar rol "Analista" (Rol por defecto asignado: authenticated)
export const checkIsAnalista = async () => {
    const currentUser = await getCurrentUser();
    return currentUser.role?.id === ROL_ANALISTA_ID;
};

// Iniciar sesión
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/local', {
    email,
    password,
  });

  if (response.data.user) {
    localStorage.setItem('token', response.data.jwt);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Registrar nuevo usuario "Analista" (Rol por defecto asignado: authenticated)
export const register = async (username: string, email: string, password: string) => {
  const response = await axiosInstance.post('/auth/local/register', {
    username,
    email,
    password,
  });

  if (response.data.user) {
    // Asignar el rol "Analista"
    await axiosInstance.put(`/users/${response.data.user.id}`, {
      role: ROL_ANALISTA_ID, 
    });

    localStorage.setItem('token', response.data.jwt);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
