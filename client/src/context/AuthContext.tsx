// src/context/AuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


type User = {
  username: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading
  const navigate = useNavigate();

  // Fungsi untuk cek status login saat app di-load/refresh
  const checkAuthStatus = async () => {
    try {
      // Tembak API /profile, 'isAdmin' middleware akan cek cookie
      const response = await api.get("/admin/profile");
      if (response.status === 200) {
        setUser({ username: response.data.username });
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/admin/login", { username, password });
      setUser({ username: response.data.username });
      setIsAuthenticated(true);

      // --- TAMBAHKAN BARIS INI ---
      // Set loading ke false SETELAH auth berhasil
      // SEBELUM navigasi
      setIsLoading(false);
      // -----------------------------

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login Gagal:", error);
      alert("Login Gagal! Username atau password salah.");
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (error) {
      console.error("Logout Gagal:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/admin/login"); // Tendang kembali ke login
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
