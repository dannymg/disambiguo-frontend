import { useState, useEffect } from "react";
import { requisitoService } from "@/api/requisitoService";
import { versionService } from "@/api/version-service";
import { VersionRequisito, RequisitoFormData } from "@/types/entities";

type UseRequisitoFormProps = {
  modo: "crear" | "editar";
  proyectoId: string;
  initialValues?: Partial<VersionRequisito>;
  onSuccess: () => void;
};

export function useRequisitoForm({
  modo,
  proyectoId,
  initialValues,
  onSuccess,
}: UseRequisitoFormProps) {
  const [formData, setFormData] = useState<RequisitoFormData>({
    numeroID: "",
    tipo: "FUNCIONAL",
    nombre: "",
    descripcion: "",
    prioridad: "ALTA",
    version: 1,
    estadoRevision: "PENDIENTE",
  });

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");

  // Cargar valores si es edición
  useEffect(() => {
    if (modo === "editar" && initialValues) {
      const r = initialValues.requisito?.[0];
      if (!r) return;

      setFormData({
        numeroID: initialValues.numeroID?.toString().padStart(3, "0") || "",
        tipo: initialValues.tipo ?? "FUNCIONAL",
        nombre: r.nombre,
        descripcion: r.descripcion,
        prioridad: r.prioridad,
        version: r.version,
        estadoRevision: r.estadoRevision,
      });

      setDocumentId(initialValues.documentId || null);
    }
  }, [initialValues, modo]);

  const validarNumeroID = async (overrideTipo?: "FUNCIONAL" | "NO_FUNCIONAL"): Promise<boolean> => {
    const padded = formData.numeroID.padStart(3, "0");
    const tipo = overrideTipo || formData.tipo;
    const identificador = `${tipo === "FUNCIONAL" ? "RF-" : "RNF-"}${padded}`;

    try {
      const existe = await versionService.checkNumeroID(proyectoId, identificador);
      if (existe) {
        setError(`Ya existe un requisito con el identificador ${identificador}`);
        return false;
      } else {
        setError(null);
        return true;
      }
    } catch (err) {
      console.error("Error verificando número ID:", err);
      setError("Error al verificar el número ID.");
      return false;
    }
  };

  const handleNumeroIDBlur = async () => {
    if (!formData.numeroID.trim()) return;
    const padded = formData.numeroID.padStart(3, "0");
    setFormData((prev) => ({ ...prev, numeroID: padded }));

    if (modo === "crear") {
      await validarNumeroID();
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "numeroID") {
      const val = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, numeroID: val }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (modo === "crear" && name === "tipo" && formData.numeroID) {
        await validarNumeroID(value as "FUNCIONAL" | "NO_FUNCIONAL");
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.numeroID || !formData.nombre.trim() || !formData.descripcion.trim()) {
      setError("Todos los campos obligatorios deben completarse.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cleanNumeroID = Number(formData.numeroID.padStart(3, "0"));

      if (modo === "crear") {
        const esValido = await validarNumeroID();
        if (!esValido) return;

        await requisitoService.createRequisito(
          {
            ...formData,
            numeroID: cleanNumeroID,
            creadoPor: "",
          },
          proyectoId
        );
        setSuccessMessage("El requisito ha sido creado correctamente.");
      } else if (modo === "editar" && initialValues?.id && documentId) {
        await requisitoService.updateRequisito(initialValues.documentId, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          prioridad: formData.prioridad,
          version: formData.version + 1, // versión nueva
          estadoRevision: formData.estadoRevision,
          creadoPor: "",
          modificadoPor: "",
        });
        setSuccessMessage("El requisito ha sido actualizado correctamente.");
      } else {
        throw new Error("No se puede actualizar sin documentId e id.");
      }

      setNoticeType("success");
      setNoticeOpen(true);
      onSuccess();
    } catch (err: any) {
      console.error("Error al guardar el requisito:", err);
      setNoticeType("error");
      setNoticeOpen(true);
      setErrorMessage(err.response?.data?.error?.message || "Error al guardar el requisito");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      numeroID: "",
      tipo: "FUNCIONAL",
      nombre: "",
      descripcion: "",
      prioridad: "ALTA",
      version: 1,
      estadoRevision: "PENDIENTE",
    });
    setDocumentId(null);
    setError(null);
    setErrorMessage("");
    setSuccessMessage("");
    setNoticeOpen(false);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleNumeroIDBlur,
    handleSubmit,
    resetForm,

    error,
    loading,

    noticeOpen,
    setNoticeOpen,
    noticeType,
    successMessage,
    errorMessage,
  };
}
