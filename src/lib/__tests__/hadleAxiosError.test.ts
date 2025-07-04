import { handleAxiosError } from "@/lib/handleAxiosError";
import { AxiosError } from "axios";

describe("🧪 handleAxiosError", () => {
  it("✔️ debería imprimir el mensaje y relanzar el error", () => {
    const mockError = {
      isAxiosError: true,
      message: "Error de red",
      response: {
        data: {
          error: {
            message: "Detalle del error del servidor",
          },
        },
      },
    } as AxiosError;

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // 👇 Esperamos que lance el error recibido
    expect(() => handleAxiosError(mockError)).toThrow(mockError);

    // 👇 Verificamos que se haya impreso por consola
    expect(consoleSpy).toHaveBeenCalledWith(
      "❌ Axios error:",
      mockError.response?.data || mockError.message
    );

    consoleSpy.mockRestore();
  });
});
