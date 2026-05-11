jest.mock("@/api/versionRequisitoService");
jest.mock("@/hooks/auth");

import { requisitoService } from "@/api/requisitoService";
import { versionService } from "@/api/versionRequisitoService";
import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { RequisitoBase } from "@/types";
import { mockVersionRequisito, mockRequisito } from "@/__testUtils__/mocks";
import { ensureAnalista } from "@/hooks/auth";

const mockAxios = new MockAdapter(axios);

function cloneWithoutCircular(obj: any, seen = new WeakSet()): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (seen.has(obj)) return undefined;
  seen.add(obj);
  if (Array.isArray(obj)) return obj.map((item) => cloneWithoutCircular(item, seen));
  const clone: any = {};
  for (const key in obj) {
    clone[key] = cloneWithoutCircular(obj[key], seen);
  }
  return clone;
}

describe("🧪 requisitoService", () => {
  beforeEach(() => {
    (ensureAnalista as jest.Mock).mockResolvedValue({ email: "analista@unl.edu.ec" });
  });

  describe("crearRequisitoParaVersion", () => {
    const versionDocumentId = "VERSION-001";

    const baseData: RequisitoBase = {
      nombre: "Requisito 1",
      descripcion: "Descripción 1",
      prioridad: "MEDIA",
      version: 1,
      estadoRevision: "NO_REVISADO",
      creadoPor: "analista@unl.edu.ec",
    };

    afterEach(() => {
      mockAxios.reset();
    });

    it("✔️ crea un requisito sin modificadoPor", async () => {
      const mockClean = { ...mockRequisito, idVersionado: undefined };

      mockAxios.onPost("/requisitos").reply(200, {
        data: cloneWithoutCircular(mockClean),
      });

      const result = await requisitoService.crearRequisitoParaVersion(versionDocumentId, baseData);
      expect(result).toEqual(mockClean);

      const payloadSent = JSON.parse(mockAxios.history.post[0].data);
      expect(payloadSent.data).not.toHaveProperty("modificadoPor");
      expect(payloadSent.data.idVersionado.connect).toContain(versionDocumentId);
    });

    it("✔️ crea un requisito con modificadoPor", async () => {
      const withModificado = { ...baseData, modificadoPor: "editor@unl.edu.ec" };
      const requisitoConMod = {
        ...mockRequisito,
        modificadoPor: "editor@unl.edu.ec",
        idVersionado: undefined,
      };

      mockAxios.onPost("/requisitos").reply(200, {
        data: cloneWithoutCircular(requisitoConMod),
      });

      const result = await requisitoService.crearRequisitoParaVersion(
        versionDocumentId,
        withModificado
      );
      expect(result).toEqual(requisitoConMod);

      const payloadSent = JSON.parse(mockAxios.history.post[0].data);
      expect(payloadSent.data.modificadoPor).toBe("editor@unl.edu.ec");
    });
  });

  describe("setVersionActiva", () => {
    const proyectoId = "PROY-001";
    const identificador = "RF-001";
    const nuevoActivoId = "REQ-ACTIVO";

    const requisitos = [
      { id: 1, documentId: "REQ-001", esVersionActiva: true },
      { id: 2, documentId: "REQ-002", esVersionActiva: false },
    ];

    const versionMock = {
      ...mockVersionRequisito,
      requisito: requisitos,
    };

    beforeEach(() => {
      (versionService.getVersionRequisito as jest.Mock).mockResolvedValue(versionMock);
    });

    afterEach(() => {
      mockAxios.reset();
      jest.clearAllMocks();
    });

    it("✔️ desactiva todos los requisitos y activa el seleccionado", async () => {
      mockAxios.onPut("/requisitos/REQ-001").reply(200);
      mockAxios.onPut("/requisitos/REQ-002").reply(200);
      mockAxios.onPut(`/requisitos/${nuevoActivoId}`).reply(200);

      await requisitoService.setVersionActiva(nuevoActivoId, identificador, proyectoId);

      const calls = mockAxios.history.put.map(({ url, data }) => ({
        url,
        data: JSON.parse(data),
      }));

      expect(calls).toEqual(
        expect.arrayContaining([
          { url: "/requisitos/REQ-001", data: { data: { esVersionActiva: false } } },
          { url: "/requisitos/REQ-002", data: { data: { esVersionActiva: false } } },
          { url: `/requisitos/${nuevoActivoId}`, data: { data: { esVersionActiva: true } } },
        ])
      );
    });
  });

  describe("setEstadoRevision", () => {
    const proyectoId = "PROY-001";
    const identificador = "RF-001";
    const nuevoEstado = "CORREGIDO";

    const requisitoActivo = {
      id: 1,
      documentId: "REQ-123",
      esVersionActiva: true,
      estadoRevision: "NO_REVISADO",
    };

    const version = {
      ...mockVersionRequisito,
      requisito: [requisitoActivo],
    };

    beforeEach(() => {
      (versionService.getVersionYRequisitoActivo as jest.Mock).mockResolvedValue(version);
    });

    afterEach(() => {
      mockAxios.reset();
      jest.clearAllMocks();
    });

    it("✔️ actualiza el estado de revisión del requisito activo", async () => {
      mockAxios.onPut(`/requisitos/${requisitoActivo.documentId}`).reply(200);

      await requisitoService.setEstadoRevision(identificador, proyectoId, nuevoEstado);

      const call = mockAxios.history.put[0];
      expect(call.url).toBe(`/requisitos/${requisitoActivo.documentId}`);
      expect(JSON.parse(call.data)).toEqual({ data: { estadoRevision: nuevoEstado } });
    });
  });

  describe("checkNumeroID", () => {
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

    it("❌ retorna false si ocurre un error", async () => {
      mockAxios.onGet("/version-requisitos").networkError();

      const result = await requisitoService.checkNumeroID(proyectoId, identificador);
      expect(result).toBe(false);
    });
  });
});
