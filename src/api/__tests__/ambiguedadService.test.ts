import { ambiguedadService } from "@/api/ambiguedadService";
import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { ensureAnalista } from "@/hooks/auth";
import {
  mockUser,
  mockVersionRequisito,
  mockAmbiguedad,
  mockCorreccion,
} from "@/__testUtils__/mocks";

jest.mock("@/hooks/auth");

const mockAxios = new MockAdapter(axios);

describe("🧪 ambiguedadService.guardarResultadoLLM", () => {
  const proyectoId = "PROY-001";
  const identificador = "RF-001";

  it("❌ lanza un error si no se encuentra el requisito activo", async () => {
    const versionSinRequisito = { ...mockVersionRequisito, requisito: [] };

    mockAxios.onGet("/version-requisitos").reply(200, { data: [versionSinRequisito] });

    await expect(
      ambiguedadService.guardarResultadoLLM({
        proyectoId,
        identificador,
        nombreAmbiguedad: "Ambigüedad faltante",
        explicacionAmbiguedad: "No se detectó el requisito activo",
        tipoAmbiguedad: "SEMANTICA",
        descripcionGenerada: "Texto generado por LLM",
      })
    ).rejects.toThrow(`No se encontró el requisito activo para ${identificador}`);
  });

  beforeEach(() => {
    (ensureAnalista as jest.Mock).mockResolvedValue(mockUser);

    // Versión segura de versionRequisito
    const versionSafe = {
      ...mockVersionRequisito,
      requisito: mockVersionRequisito.requisito!.map((req) => ({
        ...req,
        idVersionado: undefined,
      })),
    };

    // Versión segura de ambigüedad sin ciclo
    const ambiguedadSafe = { ...mockAmbiguedad, correcciones: undefined };

    // Corrección sin ambigüedad para el POST
    const correccionSafe = { ...mockCorreccion, idAmbiguedad: undefined };

    mockAxios.onGet("/version-requisitos").reply(200, { data: [versionSafe] });
    mockAxios.onPost("/ambiguedades").reply(200, { data: ambiguedadSafe });
    mockAxios.onPut(`/requisitos/${mockVersionRequisito.requisito![0].documentId}`).reply(200);
    mockAxios.onPost("/correcciones").reply(200, { data: correccionSafe });
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("✔️ guarda una ambigüedad y crea una corrección asociada correctamente", async () => {
    const resultado = await ambiguedadService.guardarResultadoLLM({
      proyectoId,
      identificador,
      nombreAmbiguedad: mockAmbiguedad.nombre,
      explicacionAmbiguedad: mockAmbiguedad.explicacion,
      tipoAmbiguedad: mockAmbiguedad.tipoAmbiguedad,
      descripcionGenerada: mockCorreccion.textoGenerado,
    });

    expect(ensureAnalista).toHaveBeenCalled();
    // Comparación de la respuesta válida para el manejo en el Frontend
    expect(resultado).toMatchObject({
      documentId: "CORR-001",
      textoGenerado: "El sistema debe responder en menos de 2 segundos.",
      esAceptada: false,
      esModificada: false,
      comentarioModif: "",
      creadoPor: "analista@unl.edu.ec",
      modificadoPor: "",
    });
  });
});
