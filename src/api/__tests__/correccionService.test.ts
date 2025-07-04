import { correccionService } from "@/api/correccionService";
import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { getCurrentUser } from "@/hooks/auth/auth";

jest.mock("@/hooks/auth/auth");

const mockAxios = new MockAdapter(axios);

describe("🧪 correccionService.actualizarCorreccion", () => {
  const documentId = "CORR-001";
  const nuevaDescripcion = "Texto corregido";
  const comentario = "Actualización realizada";

  const fakeUser = {
    id: 1,
    email: "analista@unl.edu.ec",
    username: "analista01",
    role: {
      id: 1,
      name: "Analista",
      type: "analyst",
      description: "",
      createdAt: "",
      updatedAt: "",
    },
  };

  const mockCorreccion = {
    id: 1,
    documentId,
    textoGenerado: nuevaDescripcion,
    esModificada: true,
    comentarioModif: comentario,
    modificadoPor: fakeUser.email,
  };

  beforeEach(() => {
    (getCurrentUser as jest.Mock).mockResolvedValue(fakeUser);
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("✔️ actualiza correctamente una corrección", async () => {
    mockAxios.onPut(`/correcciones/${documentId}`).reply(200, { data: mockCorreccion });

    const result = await correccionService.actualizarCorreccion(
      documentId,
      nuevaDescripcion,
      comentario
    );

    expect(result).toEqual(mockCorreccion);

    const sent = JSON.parse(mockAxios.history.put[0].data);
    expect(sent.data).toMatchObject({
      textoGenerado: nuevaDescripcion,
      esModificada: true,
      comentarioModif: comentario,
      modificadoPor: fakeUser.email,
    });
  });
});

describe("🧪 correccionService.actualizarEsAceptada", () => {
  const documentId = "CORR-001";

  beforeEach(() => {
    mockAxios.reset();
  });

  it("✔️ actualiza esAceptada a true", async () => {
    mockAxios.onPut(`/correcciones/${documentId}`).reply(200);

    await correccionService.actualizarEsAceptada(documentId, true);

    const sent = JSON.parse(mockAxios.history.put[0].data);
    expect(sent.data.esAceptada).toBe(true);
  });

  it("✔️ actualiza esAceptada a false", async () => {
    mockAxios.onPut(`/correcciones/${documentId}`).reply(200);

    await correccionService.actualizarEsAceptada(documentId, false);

    const sent = JSON.parse(mockAxios.history.put[0].data);
    expect(sent.data.esAceptada).toBe(false);
  });
});
