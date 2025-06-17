// components/app/proyectos/useNewProjectForm.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { proyectoService } from '@/api/proyecto-service';
import { getCurrentUser } from '@/hooks/auth/auth';

export function useNewProjectForm() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [contexto, setContexto] = useState('');
  const [palabrasClave, setPalabrasClave] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setPalabrasClave([...palabrasClave, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setPalabrasClave(palabrasClave.filter((_, i) => i !== index));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !titulo.trim() ||
      !descripcion.trim() ||
      !objetivo.trim() ||
      !contexto.trim() ||
      palabrasClave.length === 0
    ) {
      setErrorMessage('Todos los campos son obligatorios, incluyendo al menos una palabra clave.');
      setErrorDialogOpen(true);
      return;
    }

    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      await proyectoService.createProyecto({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        objetivo: objetivo.trim(),
        contexto: contexto.trim(),
        palabrasClave,
        version: 1,
        esActivo: true,
        listaRequisitos: [],
        creadoPor: currentUser.email,
      });

      setSuccessDialogOpen(true);

      setTimeout(() => router.push('/proyectos'), 5000);
    } catch (err) {
      console.error('Error al guardar el proyecto:', err);
      setErrorMessage(
        (err as any)?.response?.data?.error?.message ||
        'Hubo un error al guardar el proyecto.'
      );
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push('/proyectos');

  return {
    // datos
    titulo, descripcion, objetivo, contexto, palabrasClave, newKeyword,

    // estados
    loading,
    successDialogOpen,
    errorDialogOpen,
    errorMessage,

    // setters
    setTitulo,
    setDescripcion,
    setObjetivo,
    setContexto,
    setPalabrasClave,
    setNewKeyword,
    setSuccessDialogOpen,
    setErrorDialogOpen,

    // acciones
    handleAddKeyword,
    handleRemoveKeyword,
    handleSave,
    handleCancel,
  };
}
