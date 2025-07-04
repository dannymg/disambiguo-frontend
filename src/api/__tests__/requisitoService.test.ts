import { requisitoService } from "@/api/requisitoService";
import { versionService } from "@/api/versionRequisitoService";
import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { RequisitoBase, Requisito, VersionRequisito } from "@/types";

const mockAxios = new MockAdapter(axios);

describe("🧪 crearRequisitoParaVersion", () => {
  const versionDocumentId = "VERSION-001";

  const baseData: RequisitoBase = {
    nombre: "Requisito 1",
    descripcion: "Descripción 1",
    prioridad: "MEDIA",
    version: 1,
    estadoRevision: "PENDIENTE",
    creadoPor: "analista@unl.edu.ec",
  };
  const fakeProyecto = {
    id: 1,
    documentId: "PROY-001",
    titulo: "Proyecto Prueba",
    descripcion: "",
    contexto: "",
    objetivo: "",
    palabrasClave: [],
    version: 1,
    esActivo: true,
    usuarios: [],
    listaRequisitos: [],
    creadoPor: "admin@unl.edu.ec", // Valor dummy para cumplir el tipo
  };

  const fakeVersionado: VersionRequisito = {
    id: 9,
    documentId: versionDocumentId,
    numeroID: 1,
    tipo: "FUNCIONAL",
    identificador: "RF-001",
    proyecto: fakeProyecto,
    requisito: [],
  };

  const fakeRequisito: Requisito = {
    id: 1,
    documentId: "REQ-123",
    nombre: baseData.nombre,
    descripcion: baseData.descripcion,
    prioridad: baseData.prioridad,
    version: baseData.version!, // aseguramos que no sea undefined
    estadoRevision: baseData.estadoRevision,
    esVersionActiva: true,
    creadoPor: baseData.creadoPor,
    idVersionado: fakeVersionado,
  };

  afterEach(() => {
    mockAxios.reset();
  });

  it("✔️ crea un requisito sin modificadoPor", async () => {
    mockAxios.onPost("/requisitos").reply(200, { data: fakeRequisito });

    const result = await requisitoService.crearRequisitoParaVersion(versionDocumentId, baseData);

    expect(result).toEqual(fakeRequisito);

    const payloadSent = JSON.parse(mockAxios.history.post[0].data);
    expect(payloadSent.data).not.toHaveProperty("modificadoPor");
    expect(payloadSent.data.idVersionado.connect).toContain(versionDocumentId);
  });

  it("✔️ crea un requisito con modificadoPor", async () => {
    const withModificado = { ...baseData, modificadoPor: "editor@unl.edu.ec" };
    const requisitoConModificado = {
      ...fakeRequisito,
      modificadoPor: "editor@unl.edu.ec",
    };

    mockAxios.onPost("/requisitos").reply(200, { data: requisitoConModificado });

    const result = await requisitoService.crearRequisitoParaVersion(
      versionDocumentId,
      withModificado
    );

    expect(result).toEqual(requisitoConModificado);

    const payloadSent = JSON.parse(mockAxios.history.post[0].data);
    expect(payloadSent.data.modificadoPor).toBe("editor@unl.edu.ec");
  });
});

jest.mock("@/api/versionRequisitoService");

describe("🧪 setVersionActiva", () => {
  const proyectoId = "PROY-001";
  const identificador = "RF-001";
  const nuevoActivoId = "REQ-ACTIVO";

  const requisitos: Requisito[] = [
    { id: 1, documentId: "REQ-001", esVersionActiva: true } as Requisito,
    { id: 2, documentId: "REQ-002", esVersionActiva: false } as Requisito,
  ];

  const versionMock: VersionRequisito = {
    id: 9,
    documentId: "VERSION-001",
    numeroID: 1,
    tipo: "FUNCIONAL",
    identificador,
    requisito: requisitos,
    proyecto: {
      id: 99,
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

  beforeEach(() => {
    (versionService.getVersionRequisito as jest.Mock).mockResolvedValue(versionMock);
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("✔️ desactiva todos los requisitos y activa el seleccionado", async () => {
    // Respuestas simuladas para PUT
    mockAxios.onPut("/requisitos/REQ-001").reply(200);
    mockAxios.onPut("/requisitos/REQ-002").reply(200);
    mockAxios.onPut(`/requisitos/${nuevoActivoId}`).reply(200);

    await requisitoService.setVersionActiva(nuevoActivoId, identificador, proyectoId);

    const putCalls = mockAxios.history.put.map((call) => ({
      url: call.url,
      data: JSON.parse(call.data),
    }));

    expect(putCalls).toEqual(
      expect.arrayContaining([
        { url: "/requisitos/REQ-001", data: { data: { esVersionActiva: false } } },
        { url: "/requisitos/REQ-002", data: { data: { esVersionActiva: false } } },
        { url: `/requisitos/${nuevoActivoId}`, data: { data: { esVersionActiva: true } } },
      ])
    );

    expect(mockAxios.history.put.length).toBe(3);
  });
});

jest.mock("@/api/versionRequisitoService");

describe("🧪 setEstadoRevision", () => {
  const proyectoId = "PROY-001";
  const identificador = "RF-001";
  const nuevoEstado = "CORREGIDO";

  const fakeVersionado: VersionRequisito = {
    id: 99,
    documentId: "VERSION-001",
    numeroID: 1,
    tipo: "FUNCIONAL",
    identificador: "RF-001",
    requisito: [],
    proyecto: {
      id: 1,
      documentId: "PROY-001",
      titulo: "Proyecto de prueba",
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
    documentId: "REQ-123",
    nombre: "Requisito activo",
    descripcion: "desc",
    prioridad: "MEDIA",
    version: 1,
    estadoRevision: "PENDIENTE",
    esVersionActiva: true,
    creadoPor: "analista@unl.edu.ec",
    idVersionado: fakeVersionado,
  };

  const fakeVersion: VersionRequisito = {
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

  beforeEach(() => {
    (versionService.getVersionYRequisitoActivo as jest.Mock).mockResolvedValue(fakeVersion);
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("✔️ actualiza el estado de revisión del requisito activo", async () => {
    mockAxios.onPut(`/requisitos/${requisitoActivo.documentId}`).reply(200);

    await requisitoService.setEstadoRevision(identificador, proyectoId, nuevoEstado);

    const putCall = mockAxios.history.put[0];
    expect(putCall.url).toBe(`/requisitos/${requisitoActivo.documentId}`);
    expect(JSON.parse(putCall.data)).toEqual({ data: { estadoRevision: nuevoEstado } });
  });
});

describe("🧪 checkNumeroID", () => {
  const proyectoId = "PROY-001";
  const identificador = "RF-001";

  afterEach(() => {
    mockAxios.reset();
  });

  it("✔️ retorna true si el identificador existe", async () => {
    mockAxios.onGet("/version-requisitos").reply(200, {
      data: [{ id: 1, identificador }],
    });

    const result = await requisitoService.checkNumeroID(proyectoId, identificador);
    expect(result).toBe(true);
  });

  it("✔️ retorna false si el identificador no existe", async () => {
    mockAxios.onGet("/version-requisitos").reply(200, {
      data: [],
    });

    const result = await requisitoService.checkNumeroID(proyectoId, identificador);
    expect(result).toBe(false);
  });

  it("❌ retorna false si ocurre un error en la petición", async () => {
    mockAxios.onGet("/version-requisitos").networkError();

    const result = await requisitoService.checkNumeroID(proyectoId, identificador);
    expect(result).toBe(false);
  });
});
