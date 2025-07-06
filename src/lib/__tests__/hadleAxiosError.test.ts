import { handleAxiosError } from "@/lib/handleAxiosError";
import { AxiosError } from "axios";

describe("🧪 handleAxiosError", () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("✔️ debería imprimir el response.data y relanzar el error si es AxiosError con response", () => {
    const mockError = {
      isAxiosError: true,
      message: "Error de red",
      response: {
        data: {
          error: "Detalle del error",
        },
      },
    } as AxiosError;

    expect(() => handleAxiosError(mockError)).toThrow(mockError);
    expect(consoleSpy).toHaveBeenCalledWith("❌ Axios error:", mockError.response?.data);
  });

  it("✔️ debería imprimir el mensaje si es AxiosError sin response", () => {
    const mockError = {
      isAxiosError: true,
      message: "Fallo sin respuesta",
    } as AxiosError;

    expect(() => handleAxiosError(mockError)).toThrow(mockError);
    expect(consoleSpy).toHaveBeenCalledWith("❌ Axios error:", "Fallo sin respuesta");
  });

  it("🛡️ debería imprimir mensaje genérico si no es AxiosError (Error común)", () => {
    const error = new Error("Error común");
    expect(() => handleAxiosError(error)).toThrow(error);
    expect(consoleSpy).toHaveBeenCalledWith("❌ Axios error:", "Error común");
  });

  it("🪓 debería imprimir 'Error desconocido' si el error es un objeto vacío", () => {
    const error = {} as unknown;

    expect(() => handleAxiosError(error)).toThrow();
    expect(consoleSpy).toHaveBeenCalledWith("❌ Axios error:", "Error desconocido");
  });
});
