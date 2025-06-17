import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { proyectoService } from '@/api/proyecto-service';
import { Proyecto } from '@/types/entities';
import { useAuth } from '@/hooks/auth/AuthProvider';

export function useCargarProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { user, isLoading, isAnalista } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading && user) {
        try {
          const data = await proyectoService.getAllProyectos();
          setProyectos(data);
        } catch (error: any) {
          console.error('Error al cargar proyectos:', error);
          setErrorTitle('Error al cargar proyectos');
          setErrorMessage(
            'No se pudo obtener la lista de proyectos. Intenta nuevamente más tarde.'
          );
          setErrorDialogOpen(true);

          // Redirigir si es error 401
          if (error.message.includes('401')) {
            router.push('/login');
          }
        } finally {
          setLoading(false);
        }
      } else if (!isLoading && !user) {
        router.push('/login');
      }
    };

    fetchData();
  }, [user, isLoading, router]);

  const handleCreateProject = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAnalista) {
      setErrorTitle('Permiso denegado');
      setErrorMessage(
        'No tienes permisos para crear proyectos. Solo los analistas pueden crear proyectos.'
      );
      setErrorDialogOpen(true);
      return;
    }

    router.push('/proyectos/crear');
  };

  return {
    proyectos,
    loading: loading || isLoading,
    errorDialogOpen,
    setErrorDialogOpen,
    errorTitle,
    errorMessage,
    handleCreateProject,
  };
}
