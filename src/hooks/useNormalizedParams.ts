import { useParams } from "next/navigation";

export function useNormalizedParams() {
  const params = useParams();
  console.log('params:', params);

  return {
    proyectoId: Array.isArray(params?.documentId) ? params.documentId[0] : params?.documentId,
    requisitoId: Array.isArray(params?.documentId) ? params.documentId[1] : params?.documentId,
    ambiguedadId: Array.isArray(params?.documentId) ? params.documentId[2] : params?.documentId,
    correccionId: Array.isArray(params?.documentId) ? params.documentId[3] : params?.documentId,
  };
}