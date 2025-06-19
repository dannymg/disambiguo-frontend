// import { useState } from 'react';
// import Papa, { ParseResult } from 'papaparse';
// import { requisitoService } from '@/api/requisito-service';

// export interface CsvRequisito {
//   identificador: string;
//   nombre: string;
//   descripcion: string;
//   prioridad: string;
// }

// export function useImportarRequisitos(proyectoId: string, onSuccess: (cantidad: number) => void) {
//   const [archivo, setArchivo] = useState<File | null>(null);
//   const [mensaje, setMensaje] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file && file.type !== 'text/csv') {
//       setError('Solo se permiten archivos .csv');
//       setArchivo(null);
//       return;
//     }

//     setArchivo(file);
//     setError(null);
//   };

//   const handleImportar = () => {
//     if (!archivo) {
//       setError('Debes seleccionar un archivo .csv válido');
//       return;
//     }

//     setLoading(true);
//     Papa.parse<CsvRequisito>(archivo, {
//       header: true,
//       skipEmptyLines: true,
//       complete: async (results: ParseResult<CsvRequisito>) => {
//         const datos = results.data;
//         let creados = 0;

//         try {
//           for (const item of datos) {
//             const match = item.identificador?.match(/^(RF|RNF)-(\d{3})$/i);
//             if (!match) {
//               console.warn('Identificador inválido:', item.identificador);
//               continue;
//             }

//             const tipo = match[1].toUpperCase() === 'RF' ? 'FUNCIONAL' : 'NO_FUNCIONAL';
//             const numeroID = parseInt(match[2]);

//             await requisitoService.createRequisito({
//               numeroID,
//               tipo,
//               nombre: item.nombre?.trim(),
//               descripcion: item.descripcion?.trim(),
//               prioridad: item.prioridad?.toUpperCase() as 'ALTA' | 'MEDIA' | 'BAJA',
//               version: 1,
//               estadoRevision: 'PENDIENTE',
//               creadoPor: '',
//             }, proyectoId);

//             creados++;
//           }

//           setMensaje(`${creados} requisito(s) importados correctamente.`);
//           setError(null);
//           onSuccess(creados);
//         } catch (err) {
//           console.error('Error al importar requisitos:', err);
//           setError('Ocurrió un error al importar los requisitos.');
//           setMensaje(null);
//         } finally {
//           setLoading(false);
//         }
//       },
//       error: (err) => {
//         setLoading(false);
//         setError('Error al leer el archivo: ' + err.message);
//       },
//     });
//   };

//   return {
//     archivo,
//     mensaje,
//     error,
//     loading,
//     handleArchivoChange,
//     handleImportar,
//   };
// }