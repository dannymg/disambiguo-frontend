import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { versionService } from "@/api/versionRequisitoService";
import { requisitoService } from "@/api/requisitoService";
import { proyectoService } from "@/api/proyectoService";
import { ensureAnalista } from "@/hooks/auth";
import { RequisitoBase } from "@/types";
import { mockUser, mockProyecto, mockVersionRequisito, mockRequisito } from "@/__testUtils__/mocks";

jest.mock("@/hooks/auth");
jest.mock("@/api/proyectoService");
jest.mock("@/api/requisitoService");

const mockAxios = new MockAdapter(axios);

const mockedEnsureAnalista = ensureAnalista as jest.Mock;
const mockedGetProyectoByDocumentId = proyectoService.getProyectoByDocumentId as jest.Mock;
const mockedCrearRequisitoParaVersion = requisitoService.crearRequisitoParaVersion as jest.Mock;

function cloneWithoutCircular(obj: any, seen = new WeakSet()): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (seen.has(obj)) return undefined;
  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => cloneWithoutCircular(item, seen));
  }

  const clone: any = {};
  for (const key in obj) {
    clone[key] = cloneWithoutCircular(obj[key], seen);
  }
  return clone;
}

afterEach(() => {
  mockAxios.reset();
  jest.clearAllMocks();
});

describe("🧪 versionService", () => {
  describe("getVersionRequisito", () => {
    it("✔️ retorna correctamente un VersionRequisito", async () => {
      mockAxios.onGet("/version-requisitos").reply(200, {
        data: [cloneWithoutCircular(mockVersionRequisito)],
      });

      const result = await versionService.getVersionRequisito(
        mockVersionRequisito.identificador!,
        mockProyecto.documentId
      );
      expect(result).toEqual(cloneWithoutCircular(mockVersionRequisito));
    });
  });

  describe("getAllVersionesYRequisitoActivo", () => {
    it("✔️ retorna lista de versiones con requisito activo", async () => {
      mockAxios.onGet("/version-requisitos").reply(200, {
        data: [
          cloneWithoutCircular({
            ...mockVersionRequisito,
            requisito: [
              { ...mockRequisito, esVersionActiva: true },
              { ...mockRequisito, esVersionActiva: false, id: 2 },
            ],
          }),
        ],
      });

      const result = await versionService.getAllVersionesYRequisitoActivo(mockProyecto.documentId);
      expect(result).toHaveLength(1);
      expect(result[0].requisito?.[0]?.esVersionActiva).toBe(true);
    });
  });

  describe("getVersionYRequisitoActivo", () => {
    it("✔️ retorna versión específica con requisito activo", async () => {
      const data = [{ ...mockVersionRequisito, requisito: [{ esVersionActiva: true }] }];
      mockAxios.onGet("/version-requisitos").reply(200, { data });

      const result = await versionService.getVersionYRequisitoActivo(
        mockVersionRequisito.identificador!,
        mockProyecto.documentId
      );
      expect(result?.requisito?.[0].esVersionActiva).toBe(true);
    });
  });

  describe("getAllHistorialDeRequisitos", () => {
    it("✔️ retorna el historial completo de requisitos", async () => {
      mockAxios.onGet("/version-requisitos").reply(200, {
        data: [
          cloneWithoutCircular({
            ...mockVersionRequisito,
            requisito: [
              { ...mockRequisito, descripcion: "v1" },
              { ...mockRequisito, descripcion: "v2", id: 2 },
            ],
          }),
        ],
      });

      const result = await versionService.getAllHistorialDeRequisitos(
        mockVersionRequisito.identificador!,
        mockProyecto.documentId
      );
      expect(result).toHaveLength(2);
      expect(result[0].descripcion).toBe("v1");
    });
  });

  describe("createVersionRequisito", () => {
    const fakeVersion = {
      ...mockVersionRequisito,
      proyecto: mockProyecto.id,
    };

    const requisitoData = {
      numeroID: 1,
      tipo: "FUNCIONAL" as const,
      nombre: "Requisito nuevo",
      descripcion: "Debe permitir login",
      prioridad: "MEDIA" as const,
      version: 1,
      estadoRevision: "NO_REVISADO" as const,
      creadoPor: mockUser.email,
    };

    beforeEach(() => {
      mockedEnsureAnalista.mockResolvedValue(mockUser);
      mockedGetProyectoByDocumentId.mockResolvedValue(mockProyecto);
      mockedCrearRequisitoParaVersion.mockResolvedValue({});
    });

    it("✔️ crea correctamente una versión y su requisito", async () => {
      mockAxios.onPost("/version-requisitos").reply(200, {
        data: cloneWithoutCircular(fakeVersion),
      });

      const result = await versionService.createVersionRequisito(
        requisitoData,
        mockProyecto.documentId
      );

      expect(mockedCrearRequisitoParaVersion).toHaveBeenCalledWith(
        fakeVersion.documentId,
        expect.objectContaining({ nombre: requisitoData.nombre })
      );
      expect(result).toEqual(cloneWithoutCircular(fakeVersion));
    });
  });

  describe("updateVersionRequisito", () => {
    const requisitoData: RequisitoBase = {
      nombre: "Nuevo requisito",
      descripcion: "Texto nuevo",
      prioridad: "ALTA",
      estadoRevision: "CORREGIDO",
      creadoPor: "original@user.com",
    };

    const activo = {
      id: 1,
      documentId: "REQ-ACTIVO",
      version: 1,
      esVersionActiva: true,
      creadoPor: requisitoData.creadoPor,
    };

    const todasLasVersiones = {
      ...mockVersionRequisito,
      requisito: [activo, { version: 1 }, { version: 2 }],
    };

    const nuevoRequisito = {
      id: 3,
      version: 3,
      nombre: requisitoData.nombre,
      descripcion: requisitoData.descripcion,
    };

    beforeEach(() => {
      mockedEnsureAnalista.mockResolvedValue({ ...mockUser, email: "nuevo@user.com" });
      mockedCrearRequisitoParaVersion.mockResolvedValue(nuevoRequisito);
    });

    it("✔️ actualiza una nueva versión correctamente", async () => {
      mockAxios
        .onGet("/version-requisitos")
        .replyOnce(200, {
          data: [{ ...mockVersionRequisito, requisito: [activo] }],
        })
        .onPut(`/requisitos/${activo.documentId}`)
        .replyOnce(200)
        .onGet("/version-requisitos")
        .replyOnce(200, {
          data: [todasLasVersiones],
        });

      const result = await versionService.updateVersionRequisito(
        mockVersionRequisito.documentId,
        requisitoData
      );

      expect(mockedCrearRequisitoParaVersion).toHaveBeenCalledWith(
        mockVersionRequisito.documentId,
        {
          nombre: requisitoData.nombre,
          descripcion: requisitoData.descripcion,
          prioridad: requisitoData.prioridad,
          version: 3,
          estadoRevision: requisitoData.estadoRevision,
          creadoPor: requisitoData.creadoPor,
          modificadoPor: "nuevo@user.com",
        }
      );
      expect(result).toEqual(nuevoRequisito);
    });
  });

  describe("deleteVersionYRequisitos", () => {
    const requisitos = [
      { id: 1, documentId: "REQ-001" },
      { id: 2, documentId: "REQ-002" },
    ];

    const versionConRequisitos = {
      ...mockVersionRequisito,
      documentId: "VERSION-DEL",
      requisito: requisitos,
    };

    beforeEach(() => {
      mockedEnsureAnalista.mockResolvedValue(mockUser);
    });

    it("✔️ elimina correctamente la versión y sus requisitos", async () => {
      mockAxios.onGet("/version-requisitos").reply(200, {
        data: [cloneWithoutCircular(versionConRequisitos)],
      });

      mockAxios.onDelete("/requisitos/REQ-001").reply(200);
      mockAxios.onDelete("/requisitos/REQ-002").reply(200);
      mockAxios.onDelete("/version-requisitos/VERSION-DEL").reply(200);

      await versionService.deleteVersionYRequisitos("VERSION-DEL");

      expect(mockAxios.history.delete.map((d) => d.url)).toEqual([
        "/requisitos/REQ-001",
        "/requisitos/REQ-002",
        "/version-requisitos/VERSION-DEL",
      ]);
    });
  });
});
