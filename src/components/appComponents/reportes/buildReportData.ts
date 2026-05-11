import { Proyecto } from "@/types";

export const buildReportData = (proyecto: Proyecto, config: any) => {
  // 🔥 1. Extraer requisitos activos (CON IDENTIFICADOR)
  const requisitos = (proyecto.listaRequisitos ?? [])
    .flatMap((v) =>
      (v.requisito ?? []).map((r) => ({
        ...r,
        identificador: v.identificador, // 🔥 clave
        numeroID: v.numeroID,
        tipo: v.tipo,
      }))
    )
    .filter((r) => r?.esVersionActiva);

  // 🔥 2. Estados en ORDEN deseado + label amigable
  const estadosConfig = [
    { key: "NO_REVISADO", label: "No revisados" },
    { key: "AMBIGUO", label: "Ambiguos" },
    { key: "NO_AMBIGUO", label: "No ambiguos" },
    { key: "CORREGIDO", label: "Corregidos automáticamente" },
    { key: "MODIFICADO", label: "Modificados manualmente" },
    { key: "NO_VALIDADO", label: "Validación rechazada" },
    { key: "VALIDADO", label: "Validación aceptada" },
  ];

  // 🔥 3. Conteo por estado
  const conteoEstados: Record<string, number> = {};

  estadosConfig.forEach(({ key }) => {
    conteoEstados[key] = requisitos.filter((r) => r.estadoRevision === key).length;
  });

  // 🔥 4. Base del reporte
  const report: any = {
    proyecto: {
      titulo: proyecto.titulo,
      descripcion: proyecto.descripcion,
      objetivo: proyecto.objetivo,
      contexto: proyecto.contexto,
    },
  };

  // 🔥 5. Resumen estructurado
  if (config.resumen) {
    const total = requisitos.length;

    report.resumen = {
      total,

      filas: estadosConfig.map(({ key, label }) => ({
        estado: label,
        cantidad: conteoEstados[key],
        porcentaje: total > 0 ? (conteoEstados[key] / total) * 100 : 0,
      })),

      porcentajeAmbiguos: total > 0 ? (conteoEstados["AMBIGUO"] / total) * 100 : 0,

      porcentajeValidados: total > 0 ? (conteoEstados["VALIDADO"] / total) * 100 : 0,
    };
  }

  // 🔥 6. Listado de requisitos (VALIDADOS)
  if (config.requisitos) {
    report.requisitos = {
      validados: requisitos
        .filter((r) => r.estadoRevision === "VALIDADO")
        .map((r) => ({
          identificador: r.identificador || "-", // ✅ ya funciona
          nombre: r.nombre || "",
          descripcion: r.descripcion || "",
          prioridad: r.prioridad || "",
          version: r.version || "",
        })),
    };
  }

  // 🔥 6. Listado de requisitos
  if (config.requisitos) {
    report.requisitos = {
      // ✅ 3.1 Validados
      validados: requisitos
        .filter((r) => r.estadoRevision === "VALIDADO")
        .map((r) => ({
          identificador: r.identificador || "-",
          nombre: r.nombre || "",
          descripcion: r.descripcion || "",
          prioridad: r.prioridad || "",
          version: r.version || "",
        })),

      // 🔥 3.2 Todos los demás (NO VALIDADO)
      otros: requisitos
        .filter((r) => r.estadoRevision !== "VALIDADO")
        .map((r) => ({
          identificador: r.identificador || "-",
          nombre: r.nombre || "",
          descripcion: r.descripcion || "",
          prioridad: r.prioridad || "",
          version: r.version || "",
          estado: r.estadoRevision || "", // 🔥 importante
        })),
    };
  }

  // 🔥 7. Historial de requisitos
  if (config.historial) {
    report.historial = (proyecto.listaRequisitos ?? []).map((v) => ({
      identificador: v.identificador || `REQ-${v.numeroID}`,

      versiones: (v.requisito ?? [])
        .sort((a, b) => (a.version || 0) - (b.version || 0))
        .map((r) => ({
          version: r.version ?? "-",
          nombre: r.nombre ?? "",
          descripcion: r.descripcion ?? "",
          prioridad: r.prioridad ?? "",
          estado: r.estadoRevision ?? "",

          // 🔥 AMBIGÜEDAD (1 a 1, NO ARRAY)
          ambiguedad: r.ambiguedad
            ? {
                nombre: r.ambiguedad.nombre,
                explicacion: r.ambiguedad.explicacion,
                tipo: r.ambiguedad.tipoAmbiguedad,

                // 🔥 CORRECCIONES (ARRAY dentro de objeto)
                correcciones: (r.ambiguedad.correcciones ?? []).map((c) => ({
                  texto: c.textoGenerado,
                  aceptada: c.esAceptada,
                  modificada: c.esModificada,
                })),
              }
            : null,
        })),
    }));

    console.log("DEBUG HISTORIAL:", JSON.stringify(report.historial, null, 2));
  }

  // 🔥 7. Historial de requisitos
  if (config.recomendaciones) {
    report.recomendaciones = true;
  }

  return report;
};
