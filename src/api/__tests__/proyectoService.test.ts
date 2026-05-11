import { proyectoService } from "@/api/proyectoService";
import axiosInstance from "@/lib/axios";
import { ensureAnalista, getCurrentUser } from "@/hooks/auth";
import { mockUser } from "@/__testUtils__/mocks/user.mock";
import {
  mockProyecto,
  mockProyectoCreate,
  mockProyectoUpdate,
} from "@/__testUtils__/mocks/proyecto.mock";

jest.mock("@/lib/axios");
jest.mock("@/hooks/auth");

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;
const mockedGetCurrentUser = getCurrentUser as jest.Mock;
const mockedEnsureAnalista = ensureAnalista as jest.Mock;

describe("proyectoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProyectos", () => {
    it("devuelve todos los proyectos del usuario actual", async () => {
      mockedGetCurrentUser.mockResolvedValue(mockUser);
      mockedAxios.get.mockResolvedValue({ data: { data: [mockProyecto] } });

      const result = await proyectoService.getAllProyectos();

      expect(getCurrentUser).toHaveBeenCalled();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/proyectos",
        expect.objectContaining({
          params: expect.objectContaining({
            filters: {
              usuarios: {
                id: { $eq: mockUser.id },
              },
            },
          }),
        })
      );
      expect(result).toEqual([mockProyecto]);
    });
  });

  describe("getProyectoByDocumentId", () => {
    it("devuelve un proyecto por documentId", async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: mockProyecto } });

      const result = await proyectoService.getProyectoByDocumentId(mockProyecto.documentId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/proyectos/${mockProyecto.documentId}`,
        expect.any(Object)
      );
      expect(result).toEqual(mockProyecto);
    });
  });

  describe("createProyecto", () => {
    it("crea un proyecto si el usuario es analista", async () => {
      mockedEnsureAnalista.mockResolvedValue(mockUser);
      mockedAxios.post.mockResolvedValue({ data: { data: mockProyecto } });

      const result = await proyectoService.createProyecto(mockProyectoCreate);

      expect(ensureAnalista).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalledWith("/proyectos", {
        data: {
          ...mockProyectoCreate,
          usuarios: {
            connect: [mockUser.id],
          },
        },
      });
      expect(result).toEqual(mockProyecto);
    });

    it("lanza error si el usuario no es analista", async () => {
      mockedEnsureAnalista.mockRejectedValue(
        new Error("No tienes permisos para realizar esta operación.")
      );

      await expect(proyectoService.createProyecto(mockProyectoCreate)).rejects.toThrow(
        "No tienes permisos para realizar esta operación."
      );
    });
  });

  describe("updateProyecto", () => {
    it("actualiza un proyecto si el usuario es analista", async () => {
      mockedEnsureAnalista.mockResolvedValue(mockUser);
      mockedAxios.put.mockResolvedValue({ data: { data: mockProyecto } });

      const result = await proyectoService.updateProyecto(
        mockProyecto.documentId,
        mockProyectoUpdate
      );

      expect(ensureAnalista).toHaveBeenCalled();
      expect(mockedAxios.put).toHaveBeenCalledWith(`/proyectos/${mockProyecto.documentId}`, {
        data: {
          ...mockProyectoUpdate,
          palabrasClave: mockProyectoUpdate.palabrasClave ?? [],
        },
      });
      expect(result).toEqual(mockProyecto);
    });

    it("lanza error si el usuario no es analista al actualizar", async () => {
      mockedEnsureAnalista.mockRejectedValue(
        new Error("No tienes permisos para realizar esta operación.")
      );

      await expect(proyectoService.updateProyecto("PROY-001", mockProyectoUpdate)).rejects.toThrow(
        "No tienes permisos para realizar esta operación."
      );
    });
  });

  describe("deleteProyecto", () => {
    it("elimina un proyecto si el usuario es analista", async () => {
      mockedEnsureAnalista.mockResolvedValue(mockUser);
      mockedAxios.delete.mockResolvedValue({ data: {} });

      await proyectoService.deleteProyecto(mockProyecto.documentId);

      expect(ensureAnalista).toHaveBeenCalled();
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/proyectos/${mockProyecto.documentId}`);
    });

    it("lanza error si el usuario no es analista al eliminar", async () => {
      mockedEnsureAnalista.mockRejectedValue(
        new Error("No tienes permisos para realizar esta operación.")
      );

      await expect(proyectoService.deleteProyecto("PROY-001")).rejects.toThrow(
        "No tienes permisos para realizar esta operación."
      );
    });
  });
});
