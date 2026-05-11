import { VersionRequisito } from "@/types";

export type RequisitoTableColumnKey =
  | "identificador"
  | "nombre"
  | "descripcion"
  | "prioridad"
  | "estadoRevision"
  | "version";

export type SortOrder = "asc" | "desc";

const PRIORIDAD_ORDEN = ["ALTA", "MEDIA", "BAJA"];

export function sortVersionRequisitos(
  data: VersionRequisito[],
  sortColumn: RequisitoTableColumnKey,
  sortOrder: SortOrder
): VersionRequisito[] {
  return [...data].sort((a, b) => {
    const aReq = a.requisito?.[0];
    const bReq = b.requisito?.[0];
    if (!aReq || !bReq) return 0;

    let valA: string | number | undefined;
    let valB: string | number | undefined;

    switch (sortColumn) {
      case "identificador":
        valA = a.identificador;
        valB = b.identificador;
        break;
      case "nombre":
        valA = aReq.nombre;
        valB = bReq.nombre;
        break;
      case "descripcion":
        valA = aReq.descripcion;
        valB = bReq.descripcion;
        break;
      case "prioridad":
        valA = PRIORIDAD_ORDEN.indexOf(aReq.prioridad);
        valB = PRIORIDAD_ORDEN.indexOf(bReq.prioridad);
        break;
      case "estadoRevision":
        valA = aReq.estadoRevision;
        valB = bReq.estadoRevision;
        break;
      case "version":
        valA = aReq.version;
        valB = bReq.version;
        break;
      default:
        return 0;
    }

    if (valA == null || valB == null) return 0;
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}
