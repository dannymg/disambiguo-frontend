import { ambiguedadService } from "@/api/ambiguedadService";
import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { checkIsAnalista, getCurrentUser } from "@/hooks/auth/auth";
import { Ambiguedad, Correccion, VersionRequisito, Requisito, User } from "@/types";

jest.mock("@/hooks/auth/auth");

const mockAxios = new MockAdapter(axios);

describe("🧪 ambiguedadService.guardarResultadoLLM", () => {
  const proyectoId = "PROY-001";
  const identificador = "RF-001";

  const analista: User = {
    id: 1,
    username: "analista01",
    email: "analista@unl.edu.ec",
    provider: "local",
    confirmed: true,
    blocked: false,
    role: {
      id: 1,
      name: "Analista",
      description: "",
      type: "analyst",
      createdAt: "",
      updatedAt: "",
    },
    proyectos: [],
    createdAt: "",
    updatedAt: "",
  };
  const fakeVersionado: VersionRequisito = {
    id: 9,
    documentId: "VERSION-001",
    numeroID: 1,
    tipo: "FUNCIONAL",
    identificador: "RF-001",
    requisito: [],
    proyecto: {
      id: 1,
      documentId: "PROY-001",
      titulo: "Proyecto prueba",
      descripcion: "",
      contexto: "",
      objetivo: "",
      palabrasClave: [],
      version: 1,
      esActivo: true,
      usuarios: [],
      listaRequisitos: [],
      creadoPor: "admin@unl.edu.ec",
    },
  };

  const requisitoActivo: Requisito = {
    id: 1,
    documentId: "REQ-001",
    nombre: "Requisito de prueba",
    descripcion: "desc",
    prioridad: "ALTA",
    version: 1,
    estadoRevision: "PENDIENTE",
    esVersionActiva: true,
    creadoPor: "analista@unl.edu.ec",
    idVersionado: fakeVersionado,
  };

  const versionMock: VersionRequisito = {
    id: 10,
    documentId: "VERSION-001",
    numeroID: 1,
    tipo: "FUNCIONAL",
    identificador,
    requisito: [requisitoActivo],
    proyecto: {
      id: 1,
      documentId: proyectoId,
      titulo: "Proyecto",
      descripcion: "",
      contexto: "",
      objetivo: "",
      palabrasClave: [],
      version: 1,
      esActivo: true,
      usuarios: [],
      listaRequisitos: [],
      creadoPor: "admin@unl.edu.ec",
    },
  };

  const ambiguedadCreada: Ambiguedad = {
    id: 100,
    documentId: "AMB-100",
    nombre: "Ambigüedad ejemplo",
    explicacion: "Esta es una ambigüedad detectada",
    tipoAmbiguedad: "LEXICA",
  };

  const correccionEsperada: Correccion = {
    id: 200,
    documentId: "CORR-200",
    textoGenerado: "Descripción corregida",
    esAceptada: false,
    esModificada: false,
    comentarioModif: "",
    creadoPor: analista.email,
    idAmbiguedad: ambiguedadCreada,
    // modificadoPor no se incluye
  };

  it("❌ lanza un error si no se encuentra el requisito activo", async () => {
    const versionSinRequisito: VersionRequisito = {
      ...versionMock,
      requisito: [], // ✅ Simula que no hay requisito activo
    };

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
    (checkIsAnalista as jest.Mock).mockResolvedValue(true);
    (getCurrentUser as jest.Mock).mockResolvedValue(analista);

    // Mock GET requisito activo
    mockAxios.onGet("/version-requisitos").reply(200, { data: [versionMock] });

    // Mock POST ambigüedad
    mockAxios.onPost("/ambiguedades").reply(200, { data: ambiguedadCreada });

    // Mock PUT para conectar ambigüedad al requisito
    mockAxios.onPut(`/requisitos/${requisitoActivo.documentId}`).reply(200);

    // Mock POST corrección
    mockAxios.onPost("/correcciones").reply(200, { data: correccionEsperada });
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("✔️ guarda una ambigüedad y crea una corrección asociada correctamente", async () => {
    const resultado = await ambiguedadService.guardarResultadoLLM({
      proyectoId,
      identificador,
      nombreAmbiguedad: "Ambigüedad ejemplo",
      explicacionAmbiguedad: "Esta es una ambigüedad detectada",
      tipoAmbiguedad: "LEXICA",
      descripcionGenerada: "Descripción corregida",
    });

    expect(checkIsAnalista).toHaveBeenCalled();
    expect(getCurrentUser).toHaveBeenCalled();
    expect(resultado).toEqual(correccionEsperada);
  });
});
