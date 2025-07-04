import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { versionService } from "@/api/versionRequisitoService";
import { requisitoService } from "@/api/requisitoService";
import { proyectoService } from "@/api/proyectoService";
import { getCurrentUser, checkIsAnalista } from "@/hooks/auth/auth";
import { RequisitoBase } from "@/types";

jest.mock("@/hooks/auth/auth");
jest.mock("@/api/proyectoService");
jest.mock("@/api/requisitoService");

const mockAxios = new MockAdapter(axios);
const proyectoId = "PROY-001";
const identificador = "RF-001";

afterEach(() => {
  mockAxios.reset();
  jest.clearAllMocks();
});

describe("🧪 getVersionRequisito", () => {
  it("✔️ retorna correctamente un VersionRequisito", async () => {
    const fakeData = [{ id: 1, identificador, requisito: [] }];
    mockAxios.onGet("/version-requisitos").reply(200, { data: fakeData });

    const result = await versionService.getVersionRequisito(identificador, proyectoId);
    expect(result).toEqual(fakeData[0]);
  });
});

describe("🧪 getAllVersionesYRequisitoActivo", () => {
  it("✔️ retorna una lista de VersionRequisito con requisito activo", async () => {
    const fakeData = [
      { id: 1, identificador: "RF-001", requisito: [{ esVersionActiva: true }] },
      { id: 2, identificador: "RF-002", requisito: [{ esVersionActiva: true }] },
    ];
    mockAxios.onGet("/version-requisitos").reply(200, { data: fakeData });

    const result = await versionService.getAllVersionesYRequisitoActivo(proyectoId);
    expect(result).toHaveLength(2);
    expect(result[0].requisito?.[0]?.esVersionActiva).toBe(true);
  });
});

describe("🧪 getVersionYRequisitoActivo", () => {
  it("✔️ retorna el VersionRequisito con su requisito activo", async () => {
    const fakeData = [
      {
        id: 5,
        identificador,
        requisito: [{ esVersionActiva: true }],
      },
    ];
    mockAxios.onGet("/version-requisitos").reply(200, { data: fakeData });

    const result = await versionService.getVersionYRequisitoActivo(identificador, proyectoId);
    expect(result?.requisito?.[0].esVersionActiva).toBe(true);
  });
});

describe("🧪 getAllHistorialDeRequisitos", () => {
  it("✔️ retorna el historial de requisitos de un identificador", async () => {
    const fakeData = [
      {
        id: 10,
        identificador,
        requisito: [
          { id: 1, descripcion: "v1" },
          { id: 2, descripcion: "v2" },
        ],
      },
    ];
    mockAxios.onGet("/version-requisitos").reply(200, { data: fakeData });

    const result = await versionService.getAllHistorialDeRequisitos(identificador, proyectoId);
    expect(result).toHaveLength(2);
    expect(result[0].descripcion).toBe("v1");
  });
});

describe("🧪 createVersionRequisito", () => {
  const fakeUser = { email: "analista@unl.edu.ec" };
  const fakeProyecto = { id: 999, documentId: proyectoId };
  const fakeVersion = {
    id: 1,
    documentId: "VERSION-001",
    numeroID: 1,
    tipo: "FUNCIONAL",
    identificador: "RF-001",
    proyecto: fakeProyecto.id,
  };

  const requisitoData = {
    numeroID: 1,
    tipo: "FUNCIONAL" as const,
    nombre: "Nombre prueba",
    descripcion: "Descripción de prueba",
    prioridad: "MEDIA" as const,
    version: 1,
    estadoRevision: "PENDIENTE" as const,
    creadoPor: "relleno@dummy.com", // para cumplir con el tipo
  };

  beforeEach(() => {
    (checkIsAnalista as jest.Mock).mockResolvedValue(true);
    (getCurrentUser as jest.Mock).mockResolvedValue(fakeUser);
    (proyectoService.getProyectoByDocumentId as jest.Mock).mockResolvedValue(fakeProyecto);
    (requisitoService.crearRequisitoParaVersion as jest.Mock).mockResolvedValue({});
  });

  it("✔️ crea correctamente una nueva versión de requisito con su requisito asociado", async () => {
    mockAxios.onPost("/version-requisitos").reply(200, { data: fakeVersion });

    const result = await versionService.createVersionRequisito(requisitoData, proyectoId);

    expect(checkIsAnalista).toHaveBeenCalled();
    expect(getCurrentUser).toHaveBeenCalled();
    expect(proyectoService.getProyectoByDocumentId).toHaveBeenCalledWith(proyectoId);

    expect(result).toEqual(fakeVersion);
    expect(requisitoService.crearRequisitoParaVersion).toHaveBeenCalledWith("VERSION-001", {
      nombre: requisitoData.nombre,
      descripcion: requisitoData.descripcion,
      prioridad: requisitoData.prioridad,
      version: requisitoData.version,
      estadoRevision: requisitoData.estadoRevision,
      creadoPor: fakeUser.email,
    });
  });
});

describe("🧪 updateVersionRequisito", () => {
  const versionRequisitoId = "VERSION-001";

  const requisitoData: RequisitoBase = {
    nombre: "Nuevo requisito",
    descripcion: "Actualización del requisito",
    prioridad: "ALTA",
    estadoRevision: "CORREGIDO",
    creadoPor: "relleno@dummy.com",
  };

  const fakeUser = { email: "nuevo@user.com" };
  const requisitoActivo = {
    id: 1,
    documentId: "REQ-ACTIVO",
    version: 1,
    esVersionActiva: true,
    creadoPor: "antiguo@user.com",
  };

  const fakeVersion = {
    id: 999,
    documentId: versionRequisitoId,
    requisito: [requisitoActivo],
  };

  const fakeTodasLasVersiones = {
    id: 999,
    documentId: versionRequisitoId,
    requisito: [requisitoActivo, { version: 1 }, { version: 2 }],
  };

  const nuevoRequisito = {
    id: 3,
    version: 3,
    nombre: requisitoData.nombre,
    descripcion: requisitoData.descripcion,
  };

  beforeEach(() => {
    (checkIsAnalista as jest.Mock).mockResolvedValue(true);
    (getCurrentUser as jest.Mock).mockResolvedValue(fakeUser);
    (requisitoService.crearRequisitoParaVersion as jest.Mock).mockResolvedValue(nuevoRequisito);
  });

  it("✔️ actualiza correctamente una nueva versión de requisito", async () => {
    mockAxios
      .onGet("/version-requisitos")
      .replyOnce(200, { data: [fakeVersion] }) // get requisito activo
      .onPut(`/requisitos/${requisitoActivo.documentId}`)
      .replyOnce(200) // desactivación
      .onGet("/version-requisitos") // get todas las versiones
      .replyOnce(200, { data: [fakeTodasLasVersiones] });

    const result = await versionService.updateVersionRequisito(versionRequisitoId, requisitoData);

    expect(checkIsAnalista).toHaveBeenCalled();
    expect(getCurrentUser).toHaveBeenCalled();

    expect(requisitoService.crearRequisitoParaVersion).toHaveBeenCalledWith(versionRequisitoId, {
      nombre: requisitoData.nombre,
      descripcion: requisitoData.descripcion,
      prioridad: requisitoData.prioridad,
      version: 3,
      estadoRevision: requisitoData.estadoRevision,
      creadoPor: requisitoActivo.creadoPor,
      modificadoPor: fakeUser.email,
    });

    expect(result).toEqual(nuevoRequisito);
  });
});

describe("🧪 deleteVersionYRequisitos", () => {
  const versionRequisitoId = "VERSION-123";
  const requisitos = [
    { id: 1, documentId: "REQ-001" },
    { id: 2, documentId: "REQ-002" },
  ];

  const fakeVersionResponse = {
    data: [
      {
        id: 9,
        documentId: versionRequisitoId,
        requisito: requisitos,
      },
    ],
  };

  beforeEach(() => {
    (checkIsAnalista as jest.Mock).mockResolvedValue(true);
  });

  it("✔️ elimina correctamente la versión y sus requisitos", async () => {
    // Mock: obtener la versión y sus requisitos
    mockAxios.onGet("/version-requisitos").reply(200, fakeVersionResponse);

    // Mock: eliminar cada requisito
    mockAxios.onDelete("/requisitos/REQ-001").reply(200);
    mockAxios.onDelete("/requisitos/REQ-002").reply(200);

    // Mock: eliminar la versión
    mockAxios.onDelete(`/version-requisitos/${versionRequisitoId}`).reply(200);

    await versionService.deleteVersionYRequisitos(versionRequisitoId);

    // Verifica que las llamadas DELETE fueron hechas correctamente
    expect(mockAxios.history.delete.length).toBe(3);
    expect(mockAxios.history.delete[0].url).toBe("/requisitos/REQ-001");
    expect(mockAxios.history.delete[1].url).toBe("/requisitos/REQ-002");
    expect(mockAxios.history.delete[2].url).toBe(`/version-requisitos/${versionRequisitoId}`);
  });
});
