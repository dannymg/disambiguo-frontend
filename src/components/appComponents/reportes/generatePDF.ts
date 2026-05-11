import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data: any) => {
  if (!data?.proyecto) {
    console.error("Datos inválidos para PDF");
    return;
  }

  const doc = new jsPDF();

  // ===============================
  // 🔷 CONFIGURACIÓN GENERAL
  // ===============================

  const COLORS = {
    primary: [17, 24, 39],
    secondary: [75, 85, 99],

    success: [22, 101, 52],
    warning: [180, 83, 9],
    danger: [153, 27, 27],
    info: [30, 64, 175],

    light: [249, 250, 251],
    border: [209, 213, 219],

    text: [31, 41, 55],
  };

  const marginX = 15;

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const maxWidth = pageWidth - marginX * 2;

  let y = 20;

  doc.setProperties({
    title: "Informe de Revisión de Ambigüedades",
    subject: "Reporte de análisis de requisitos",
    author: "Sistema de detección de ambigüedades",
    creator: "Aplicación de análisis de requisitos",
  });

  // ===============================
  // 🔷 CONTROL DE PÁGINA
  // ===============================

  const checkPageBreak = (spaceNeeded = 10) => {
    if (y + spaceNeeded > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // ===============================
  // 🔷 FORMATEAR LABELS
  // ===============================

  const formatLabel = (value?: string) => {
    if (!value) return "-";

    return value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/(^|\s)([a-záéíóúñü])/g, (_, space, letter) => `${space}${letter.toUpperCase()}`);
  };

  // ===============================
  // 🔷 HEADER / FOOTER
  // ===============================

  const addHeaderFooter = () => {
    const pages = doc.getNumberOfPages();

    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);

      // 🔥 NO MOSTRAR HEADER EN PORTADA
      if (i !== 1) {
        doc.setFillColor(...(COLORS.primary as [number, number, number]));

        doc.rect(0, 0, pageWidth, 9, "F");

        doc.setFont("helvetica", "bold");

        doc.setFontSize(8);

        doc.setTextColor(255);

        doc.text("Informe de Revisión de Ambigüedades", marginX, 6);
      }

      // FOOTER
      doc.setDrawColor(...(COLORS.border as [number, number, number]));

      doc.line(marginX, pageHeight - 10, pageWidth - marginX, pageHeight - 10);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(8);

      doc.setTextColor(120);

      doc.text(`Página ${i} de ${pages}`, pageWidth - marginX, pageHeight - 5, { align: "right" });
    }
  };

  // ===============================
  // 🔷 TEXTO
  // ===============================

  const addText = (text: string, size = 10, space = 4, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");

    doc.setFontSize(size);

    doc.setTextColor(...(COLORS.text as [number, number, number]));

    const lines = doc.splitTextToSize(text, maxWidth);

    checkPageBreak(lines.length * 4.5 + space);

    doc.text(lines, marginX, y);

    y += lines.length * 4.5 + space;
  };

  // ===============================
  // 🔷 TÍTULOS
  // ===============================

  const addSectionTitle = (title: string) => {
    checkPageBreak(15);

    doc.setDrawColor(...(COLORS.border as [number, number, number]));

    doc.setLineWidth(0.5);

    doc.line(marginX, y + 2, pageWidth - marginX, y + 2);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(15);

    doc.setTextColor(...(COLORS.primary as [number, number, number]));

    doc.text(title, marginX, y);

    y += 12;

    doc.setTextColor(...(COLORS.text as [number, number, number]));
  };

  // ===============================
  // 🔷 ESTILO TABLAS
  // ===============================

  const tableStyles = {
    styles: {
      font: "helvetica",

      fontSize: 8.5,

      cellPadding: 2.8,

      overflow: "linebreak" as const,

      lineColor: COLORS.border as [number, number, number],

      lineWidth: 0.1,

      textColor: COLORS.text as [number, number, number],

      valign: "middle" as const,
    },

    headStyles: {
      fillColor: COLORS.primary as [number, number, number],

      textColor: 255,

      fontStyle: "bold" as const,

      halign: "center" as const,
    },

    alternateRowStyles: {
      fillColor: [250, 250, 250] as [number, number, number],
    },
  };

  // ===============================
  // 🔷 PORTADA
  // ===============================

  doc.setFillColor(...(COLORS.primary as [number, number, number]));

  doc.rect(0, 0, pageWidth, 55, "F");

  doc.setTextColor(255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);

  doc.text("INFORME DE REVISIÓN", pageWidth / 2, 95, { align: "center" });

  doc.text("DE AMBIGÜEDADES", pageWidth / 2, 108, { align: "center" });

  doc.setDrawColor(...(COLORS.info as [number, number, number]));

  doc.setLineWidth(1);

  doc.line(pageWidth / 2 - 45, 120, pageWidth / 2 + 45, 120);

  doc.setTextColor(...(COLORS.text as [number, number, number]));

  doc.setFont("helvetica", "normal");

  doc.setFontSize(14);

  doc.text(`Proyecto: ${data.proyecto.titulo}`, pageWidth / 2, 145, { align: "center" });

  doc.setFontSize(11);

  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, pageWidth / 2, 155, {
    align: "center",
  });

  doc.setFontSize(10);

  doc.setTextColor(120);

  doc.text("Sistema de detección de ambigüedades en requisitos", pageWidth / 2, 250, {
    align: "center",
  });

  doc.addPage();

  y = 20;

  // ===============================
  // 🔷 1. DETALLE GENERAL
  // ===============================

  addSectionTitle("1. Detalle General del Proyecto");

  addText(`Título: ${data.proyecto.titulo}`, 10, 5, true);

  if (data.proyecto.descripcion) {
    addText(`Descripción: ${data.proyecto.descripcion}`);
  }

  if (data.proyecto.objetivo) {
    addText(`Objetivo: ${data.proyecto.objetivo}`);
  }

  if (data.proyecto.contexto) {
    addText(`Contexto: ${data.proyecto.contexto}`);
  }

  // ===============================
  // 🔷 2. RESUMEN EJECUTIVO
  // ===============================

  if (data.resumen) {
    addSectionTitle("2. Resumen Ejecutivo");

    addText(`Total de requisitos analizados: ${data.resumen.total}`, 10, 5, true);

    autoTable(doc, {
      startY: y,

      margin: {
        left: marginX,
        right: marginX,
      },

      tableWidth: pageWidth - marginX * 2,

      head: [["Estado de revisión", "Cantidad", "Porcentaje"]],

      body: data.resumen.filas.map((f: any) => [
        formatLabel(f.estado),
        f.cantidad,
        `${f.porcentaje.toFixed(1)}%`,
      ]),

      ...tableStyles,
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    addText(`Porcentaje de requisitos ambiguos: ${data.resumen.porcentajeAmbiguos.toFixed(1)}%`);

    addText(`Porcentaje de requisitos validados: ${data.resumen.porcentajeValidados.toFixed(1)}%`);
  }

  // ===============================
  // 🔷 3. LISTADO DE REQUISITOS
  // ===============================

  if (data.requisitos?.validados) {
    addSectionTitle("3. Listado de Requisitos");

    addSectionTitle("3.1 Requisitos Validados");

    autoTable(doc, {
      startY: y,

      margin: {
        left: marginX,
        right: marginX,
      },

      tableWidth: pageWidth - marginX * 2,

      head: [["ID", "Nombre", "Descripción", "Prioridad", "Versión"]],

      body:
        data.requisitos.validados.length > 0
          ? data.requisitos.validados.map((r: any) => [
              r.identificador,
              r.nombre,
              r.descripcion,
              formatLabel(r.prioridad),
              r.version,
            ])
          : [["-", "Sin datos disponibles", "", "", ""]],

      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: "auto" },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
      },

      ...tableStyles,
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ===============================
  // 🔷 3.2 OTROS REQUISITOS
  // ===============================

  if (data.requisitos?.otros) {
    addSectionTitle("3.2 Otros Requisitos");

    autoTable(doc, {
      startY: y,

      margin: {
        left: marginX,
        right: marginX,
      },

      tableWidth: pageWidth - marginX * 2,

      head: [["ID", "Nombre", "Descripción", "Prioridad", "Versión", "Estado"]],

      body:
        data.requisitos.otros.length > 0
          ? data.requisitos.otros.map((r: any) => [
              r.identificador,
              r.nombre,
              r.descripcion,
              formatLabel(r.prioridad),
              r.version,
              formatLabel(r.estado),
            ])
          : [["-", "Sin datos", "", "", "", ""]],

      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 53 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 32 },
      },

      ...tableStyles,
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ===============================
  // 🔷 4. HISTORIAL
  // ===============================

  if (data.historial) {
    doc.addPage();

    y = 20;

    addSectionTitle("4. Historial de Requisitos");

    data.historial.forEach((req: any) => {
      checkPageBreak(20);

      doc.setFillColor(245, 247, 250);

      doc.roundedRect(marginX, y - 5, pageWidth - marginX * 2, 10, 2, 2, "F");

      doc.setFont("helvetica", "bold");

      doc.setFontSize(12);

      doc.setTextColor(...(COLORS.primary as [number, number, number]));

      doc.text(`Requisito: ${req.identificador}`, marginX + 4, y + 1.5);

      y += 14;

      req.versiones.forEach((v: any) => {
        checkPageBreak(20);

        // 🔥 BLOQUE VISUAL DE VERSIÓN
        doc.setFillColor(...(COLORS.primary as [number, number, number]));

        doc.roundedRect(marginX, y - 2, 38, 8, 2, 2, "F");

        doc.setFont("helvetica", "bold");

        doc.setFontSize(10);

        doc.setTextColor(255);

        doc.text(`Versión ${v.version}`, marginX + 6, y + 3);

        y += 12;

        doc.setTextColor(...(COLORS.text as [number, number, number]));

        autoTable(doc, {
          startY: y,

          margin: {
            left: marginX,
            right: marginX,
          },

          tableWidth: pageWidth - marginX * 2,

          head: [["Campo", "Detalle"]],

          body: [
            ["Nombre", v.nombre],
            ["Descripción", v.descripcion],
            ["Prioridad", formatLabel(v.prioridad)],
            ["Estado", formatLabel(v.estado)],
          ],

          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: "auto" },
          },

          ...tableStyles,
        });

        y = (doc as any).lastAutoTable.finalY + 8;

        // ===============================
        // 🔷 NO REVISADO
        // ===============================

        if (v.estado === "NO_REVISADO") {
          autoTable(doc, {
            startY: y,

            head: [["Estado", "Detalle"]],

            body: [["No revisado", "Este requisito no ha sido analizado."]],

            ...tableStyles,

            headStyles: {
              fillColor: COLORS.warning as [number, number, number],
              textColor: 255,
            },
          });

          y = (doc as any).lastAutoTable.finalY + 8;

          return;
        }

        // ===============================
        // 🔷 NO AMBIGUO
        // ===============================

        if (v.estado === "NO_AMBIGUO") {
          autoTable(doc, {
            startY: y,

            head: [["Resultado", "Detalle"]],

            body: [["Sin ambigüedad", "El requisito no presenta ambigüedades."]],

            ...tableStyles,

            headStyles: {
              fillColor: COLORS.success as [number, number, number],
              textColor: 255,
            },
          });

          y = (doc as any).lastAutoTable.finalY + 8;

          return;
        }

        // ===============================
        // 🔷 AMBIGÜEDAD
        // ===============================

        if (v.ambiguedad) {
          addText("Ambigüedad detectada", 10, 4, true);

          autoTable(doc, {
            startY: y,

            margin: {
              left: marginX,
              right: marginX,
            },

            tableWidth: pageWidth - marginX * 2,

            head: [["Campo", "Detalle"]],

            body: [
              ["Nombre", v.ambiguedad.nombre ?? "-"],
              ["Explicación", v.ambiguedad.explicacion ?? "-"],
              ["Tipo", formatLabel(v.ambiguedad.tipo) ?? "-"],
            ],

            columnStyles: {
              0: { cellWidth: 40 },
              1: { cellWidth: "auto" },
            },

            ...tableStyles,

            headStyles: {
              fillColor: COLORS.danger as [number, number, number],
              textColor: 255,
            },
          });

          y = (doc as any).lastAutoTable.finalY + 8;
        }

        // ===============================
        // 🔷 CORRECCIÓN
        // ===============================

        if (v.ambiguedad?.correcciones?.length > 0) {
          addText("Corrección generada", 10, 4, true);

          autoTable(doc, {
            startY: y,

            margin: {
              left: marginX,
              right: marginX,
            },

            tableWidth: pageWidth - marginX * 2,

            head: [["Campo", "Detalle"]],

            body: [
              ["Texto generado", v.ambiguedad?.correcciones?.[0].texto],
              ["Aceptada", v.ambiguedad?.correcciones?.[0].aceptada ? "Sí" : "No"],
              ["Modificada", v.ambiguedad?.correcciones?.[0].modificada ? "Sí" : "No"],
            ],

            columnStyles: {
              0: { cellWidth: 40 },
              1: { cellWidth: "auto" },
            },

            ...tableStyles,

            headStyles: {
              fillColor: COLORS.info as [number, number, number],
              textColor: 255,
            },
          });

          y = (doc as any).lastAutoTable.finalY + 10;
        }
      });

      y += 4;
    });
  }

  // ===============================
  // 🔷 5. RECOMENDACIONES
  // ===============================

  if (data.recomendaciones) {
    doc.addPage();

    y = 20;

    addSectionTitle("5. Recomendaciones para evitar ambigüedades (ISO/IEC/IEEE 29148:2018)");

    addText(
      "Las siguientes recomendaciones están basadas en la norma ISO/IEC/IEEE 29148:2018 y tienen como objetivo mejorar la claridad y calidad de la especificación de requisitos."
    );

    const recomendaciones = [
      "Utilizar lenguaje claro, simple y no ambiguo en la redacción de requisitos.",
      "Evitar términos subjetivos o vagos como 'rápido', 'eficiente', 'fácil' u 'óptimo'.",
      "Definir criterios de aceptación verificables y medibles.",
      "Evitar el uso de pronombres ambiguos sin referencia clara.",
      "Mantener consistencia terminológica en todo el documento.",
      "Evitar construcciones ambiguas como 'y/o'.",
      "Especificar claramente actores, sistemas o componentes involucrados.",
      "Evitar requisitos compuestos o múltiples necesidades en uno solo.",
      "Asegurar la verificabilidad mediante pruebas, inspecciones o análisis.",
    ];

    autoTable(doc, {
      startY: y,

      margin: {
        left: marginX,
        right: marginX,
      },

      tableWidth: pageWidth - marginX * 2,

      head: [["Recomendaciones"]],

      body: recomendaciones.map((r) => [r]),

      ...tableStyles,
    });
  }

  // ===============================
  // 🔷 HEADER / FOOTER
  // ===============================

  addHeaderFooter();

  // ===============================
  // 🔷 EXPORTAR
  // ===============================

  const fileName = `reporte-${data.proyecto.titulo.replace(/\s+/g, "_").toLowerCase()}.pdf`;

  doc.save(fileName);
};
