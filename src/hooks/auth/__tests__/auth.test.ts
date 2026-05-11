import { getCurrentUser, login, logout, register, checkIsAnalista } from "@/hooks/auth";
import axiosInstance from "@/lib/axios";
import { AuthResponse, User } from "@/types";

jest.mock("@/lib/axios");
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("🧪 Módulo auth.ts", () => {
  const mockUser: User = {
    id: 1,
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
      createdAt: "",
      updatedAt: "",
    },
    proyectos: [],
    createdAt: "",
    updatedAt: "",
  };
  const mockAuthResponse: AuthResponse = {
    jwt: "token-prueba",
    user: mockUser,
  };

  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  beforeAll(() => {
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  // 🔐 LOGIN
  it("🔐 login guarda el jwt y user en localStorage", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const result = await login("analista@unl.edu.ec", "123456");

    expect(localStorage.setItem).toHaveBeenCalledWith("jwt", mockAuthResponse.jwt);
    expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(mockUser));

    expect(result).toEqual(mockAuthResponse);
  });

  // 🆕 REGISTER
  it("🆕 register guarda el jwt y user en localStorage", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockAuthResponse });

    const result = await register("analista01", "analista@unl.edu.ec", "123456");

    expect(localStorage.setItem).toHaveBeenCalledWith("jwt", mockAuthResponse.jwt);
    expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(mockUser));

    expect(result).toEqual(mockAuthResponse);
  });

  // 📌 GET CURRENT USER
  it("📌 getCurrentUser retorna los datos del usuario", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

    const user = await getCurrentUser();

    expect(mockedAxios.get).toHaveBeenCalledWith("/users/me?populate=role");
    expect(user).toEqual(mockUser);
  });

  // 🧾 CHECK IS ANALISTA
  it("🧾 checkIsAnalista retorna true si el rol es Analista", () => {
    const result = checkIsAnalista(mockUser);
    expect(result).toBe(true);
  });

  // 🔓 LOGOUT
  it("🔓 logout elimina jwt y user de localStorage", () => {
    logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith("jwt");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
