import { correccionService } from "@/api/correccionService";
import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import { ensureAnalista } from "@/hooks/auth";
import { mockUser } from "@/__testUtils__/mocks";

jest.mock("@/hooks/auth");

const mockAxios = new MockAdapter(axios);

describe("🧪 correccionService.actualizarCorreccion", () => {
  const documentId = "CORR-001";
  const nuevaDescripcion = "Texto corregido";
  const comentario = "Actualización realizada";

  const mockCorreccion = {
    id: 1,
    documentId,
    textoGenerado: nuevaDescripcion,
    esModificada: true,
    comentarioModif: comentario,
    modificadoPor: mockUser.email,
  };

  beforeEach(() => {
    (ensureAnalista as jest.Mock).mockResolvedValue(mockUser);
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
      modificadoPor: mockUser.email,
    });
  });
});

describe("🧪 correccionService.actualizarEsAceptada", () => {
  const documentId = "CORR-001";

  beforeEach(() => {
    (ensureAnalista as jest.Mock).mockResolvedValue(mockUser);
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
