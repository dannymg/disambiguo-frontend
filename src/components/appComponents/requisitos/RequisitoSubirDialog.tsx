import { useState } from "react";
import dynamic from "next/dynamic";
import Papa, { ParseResult } from "papaparse";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { RequisitoPreview } from "@/hooks/requisitos";
import { RequisitoSubirCsvPanel } from "./upload";

const RequisitosPreview = dynamic(() => import("./RequisitosPreview"), { ssr: false });

interface Props {
  open: boolean;
  onClose: () => void;
  proyectoId: string;
  onSuccess: (cantidad: number) => void;
}

interface CsvRequisitoRaw {
  identificador: string;
  nombre: string;
  descripcion: string;
  prioridad: string;
}

export default function RequisitoSubirDialog({ open, onClose, proyectoId, onSuccess }: Props) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<RequisitoPreview[] | null>(null);

  const resetUploadState = () => {
    setPreviewData(null);
    setArchivo(null);
    setError(null);
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "text/csv") {
      setError("Solo se permiten archivos .csv");
      setArchivo(null);
      return;
    }
    setArchivo(file);
    setError(null);
  };

  const parsearArchivo = () => {
    if (!archivo) {
      setError("Debes seleccionar un archivo .csv válido");
      return;
    }

    Papa.parse<CsvRequisitoRaw>(archivo, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CsvRequisitoRaw>) => {
        const datos = results.data;
        const requisitosTransformados: RequisitoPreview[] = [];

        for (const item of datos) {
          const match = item.identificador?.match(/^(RF|RNF)-(\d{3})$/i);
          if (!match) continue;

          const tipo = match[1].toUpperCase() === "RF" ? "FUNCIONAL" : "NO_FUNCIONAL";
          const numeroID = match[2];

          requisitosTransformados.push({
            tipo,
            numeroID,
            nombre: item.nombre?.trim() || "",
            descripcion: item.descripcion?.trim() || "",
            prioridad: item.prioridad?.toUpperCase() as "ALTA" | "MEDIA" | "BAJA",
            seleccionado: true,
          });
        }

        if (requisitosTransformados.length === 0) {
          setError("No se encontraron requisitos válidos en el archivo.");
        } else {
          setPreviewData(requisitosTransformados);
        }
      },
      error: (err) => {
        setError("Error al leer el archivo: " + err.message);
      },
    });
  };

  const descargarPlantilla = () => {
    const encabezados = ["identificador", "nombre", "descripcion", "prioridad"];
    const ejemplo = [
      [
        "RF-001",
        "Crear usuario",
        "El sistema debe permitir que un nuevo usuario se registre.",
        "ALTA",
      ],
      [
        "RNF-002",
        "Tiempo de respuesta",
        "El sistema debe responder en menos de 2 segundos.",
        "MEDIA",
      ],
    ];

    const csvContent = [encabezados, ...ejemplo].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_requisitos.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Dialog open={open && !previewData} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cargar requisitos desde archivo CSV</DialogTitle>
        <DialogContent dividers>
          <RequisitoSubirCsvPanel
            onArchivoChange={handleArchivoChange}
            onDescargarPlantilla={descargarPlantilla}
            error={error}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={parsearArchivo} variant="contained" disabled={!archivo}>
            Previsualizar
          </Button>
        </DialogActions>
      </Dialog>

      {previewData && (
        <RequisitosPreview
          open={!!previewData}
          onClose={() => resetUploadState()}
          proyectoId={proyectoId}
          requisitosCsv={previewData}
          onSuccess={(cantidad) => {
            onSuccess(cantidad);
            resetUploadState();
          }}
        />
      )}
    </>
  );
}
