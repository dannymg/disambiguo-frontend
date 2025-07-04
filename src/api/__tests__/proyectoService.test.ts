import { proyectoService } from "@/api/proyectoService";
import axiosInstance from "@/lib/axios";
import { checkIsAnalista, getCurrentUser } from "@/hooks/auth/auth";
import { Proyecto, ProyectoCreate, User, ProyectoUpdate } from "@/types";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("@/lib/axios");
jest.mock("@/hooks/auth/auth");

describe("proyectoService.getAllProyectos", () => {
  it("debería devolver los proyectos del usuario actual", async () => {
    const mockUser: User = {
      id: 7,
      username: "analista01",
      email: "analista@unl.edu.ec",
      provider: "local",
      confirmed: true,
      blocked: false,
      role: {
        id: 1,
        name: "Analista",
        description: "Usuario con rol analista",
        type: "analyst",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      proyectos: [],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };
    const mockProyectos: Proyecto[] = [
      {
        id: 1,
        documentId: "PROY-001",
        titulo: "Proyecto de ejemplo",
        descripcion: "Una prueba unitaria",
        contexto: "",
        objetivo: "",
        palabrasClave: [],
        version: 1,
        esActivo: true,
        usuarios: [mockUser],
        listaRequisitos: [],
        creadoPor: mockUser.email,
      },
    ];

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (axiosInstance.get as jest.Mock).mockResolvedValue({ data: { data: mockProyectos } });

    const proyectos = await proyectoService.getAllProyectos();

    expect(getCurrentUser).toHaveBeenCalled();
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/proyectos",
      expect.objectContaining({
        params: expect.objectContaining({
          filters: {
            usuarios: { id: { $eq: mockUser.id } },
          },
        }),
      })
    );

    expect(proyectos).toEqual(mockProyectos);
  });
});

describe("proyectoService.getProyectoByDocumentId", () => {
  it("debería obtener un proyecto por su documentId", async () => {
    const proyectoId = "PROY-001";

    const mockProyecto: Proyecto = {
      id: 1,
      documentId: proyectoId,
      titulo: "Proyecto recuperado",
      descripcion: "Descripción de prueba",
      contexto: "Contexto simulado",
      objetivo: "Validar recuperación",
      palabrasClave: ["jest", "proyecto"],
      version: 1,
      esActivo: true,
      usuarios: [],
      listaRequisitos: [],
      creadoPor: "analista@unl.edu.ec",
    };

    (axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { data: mockProyecto },
    });

    const resultado = await proyectoService.getProyectoByDocumentId(proyectoId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/proyectos/${proyectoId}`, {
      params: {
        populate: {
          usuarios: {
            fields: ["documentId", "username", "email"],
          },
          listaRequisitos: {
            populate: "*",
            fields: ["*"],
          },
        },
        fields: ["*"],
      },
    });

    expect(resultado).toEqual(mockProyecto);
  });
});

describe("proyectoService.createProyecto", () => {
  it("debería crear un nuevo proyecto si el usuario es analista", async () => {
    const mockUser: User = {
      id: 7,
      username: "analista01",
      email: "analista@unl.edu.ec",
      provider: "local",
      confirmed: true,
      blocked: false,
      role: {
        id: 1,
        name: "Analista",
        description: "Usuario con rol analista",
        type: "analyst",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      proyectos: [],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    const nuevoProyecto = {
      titulo: "Nuevo proyecto",
      descripcion: "Este es un proyecto de prueba",
      contexto: "Contexto simulado",
      objetivo: "Evaluar Jest",
      palabrasClave: ["prueba", "jest"],
    } as ProyectoCreate;

    const mockResponse: Proyecto = {
      id: 1,
      documentId: "PROY-001",
      ...nuevoProyecto,
      version: 1,
      esActivo: true,
      usuarios: [mockUser],
      listaRequisitos: [],
      creadoPor: mockUser.email,
    };

    // ✅ Mocks
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (checkIsAnalista as jest.Mock).mockResolvedValue(true);
    (axiosInstance.post as jest.Mock).mockResolvedValue({ data: { data: mockResponse } });

    const resultado = await proyectoService.createProyecto(nuevoProyecto);

    expect(getCurrentUser).toHaveBeenCalled();
    expect(checkIsAnalista).toHaveBeenCalled(); // ✅ Sin parámetros
    expect(axiosInstance.post).toHaveBeenCalledWith("/proyectos", {
      data: {
        ...nuevoProyecto,
        usuarios: {
          connect: [mockUser.id],
        },
      },
    });
    expect(resultado).toEqual(mockResponse);
  });
});

describe("proyectoService.updateProyecto", () => {
  it("debería actualizar el proyecto con los datos proporcionados", async () => {
    const proyectoId = "PROY-001";

    const datosActualizados: ProyectoUpdate = {
      titulo: "Proyecto actualizado",
      descripcion: "Descripción modificada",
      contexto: "Nuevo contexto",
      objetivo: "Nuevo objetivo",
      palabrasClave: ["jest", "unit test"],
    } as ProyectoUpdate;

    const mockResponse = {
      id: 1,
      documentId: proyectoId,
      ...datosActualizados,
      version: 2,
      esActivo: true,
      listaRequisitos: [],
      usuarios: [],
      creadoPor: "analista@unl.edu.ec",
    };

    (axiosInstance.put as jest.Mock).mockResolvedValue({ data: { data: mockResponse } });

    const resultado = await proyectoService.updateProyecto(proyectoId, datosActualizados);

    expect(axiosInstance.put).toHaveBeenCalledWith(`/proyectos/${proyectoId}`, {
      data: datosActualizados,
    });

    expect(resultado).toEqual(mockResponse);
  });
});

describe("proyectoService.eliminarProyecto", () => {
  it("debería eliminar el proyecto con el ID proporcionado", async () => {
    const proyectoId = "PROY-001";

    (axiosInstance.delete as jest.Mock).mockResolvedValue({ data: {} });

    await proyectoService.deleteProyecto(proyectoId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/proyectos/${proyectoId}`);
  });
});
