import axiosInstance from "@/lib/axios";

describe("🧪 axiosInstance", () => {
  it("✔️ debería tener la configuración por defecto", () => {
    expect(axiosInstance.defaults.baseURL).toBe("http://localhost:1337/api");
    expect(axiosInstance.defaults.headers["Content-Type"]).toBe("application/json");
  });
});
