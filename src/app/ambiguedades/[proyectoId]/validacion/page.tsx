'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { requisitoService } from '@/api/requisitoService';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ValidacionCorreccionesPage() {
  const searchParams = useSearchParams();
  const { proyectoId } = useParams() as { proyectoId: string };
  const seleccionIds = useMemo(() => searchParams.get('seleccion')?.split(',') ?? [], [searchParams]);

  const [requisitos, setRequisitos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequisitos = async () => {
      try {
        const data = await requisitoService.obtenerRequisitosConCorrecciones(proyectoId, seleccionIds);
        setRequisitos(data);
      } catch (error) {
        console.error('Error al cargar requisitos para validación:', error);
      } finally {
        setLoading(false);
      }
    };
    if (seleccionIds.length > 0) fetchRequisitos();
    else setLoading(false);
  }, [proyectoId, seleccionIds]);

  if (loading) return <p className="p-8 text-lg">Cargando correcciones...</p>;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Validación de correcciones</h1>
        <p className="text-gray-700 mb-6 text-lg">
          A continuación se presentan los requisitos junto con las correcciones seleccionadas. Verifique y valide las modificaciones propuestas.
        </p>

        {requisitos.map((req) => (
          <div key={req.documentId} className="mb-8 border p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-1">{req.identificador ?? 'Sin ID'}</h2>
            <p className="text-gray-600 italic mb-2">{req.nombre ?? 'Sin nombre'} </p>

            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="font-medium text-sm text-gray-700">Descripción original:</p>
              <p className="text-gray-800">{req.descripcionOriginal}</p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <p className="font-medium text-sm text-green-700">Corrección seleccionada:</p>
              <p className="text-green-800 font-semibold">{req.correccionSeleccionada}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
