// src/pages/AdminLogin.tsx
import { useState } from "react"; // --- BARU ---
import { useAuth } from "../context/AuthContext"; // --- BARU ---

const AdminLogin = () => {
  // Warna gold dari logo
  const goldColor = "#b99556";

  // --- STATE BARU ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth(); // Ambil fungsi login dari context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      // Navigasi sudah di-handle di dalam AuthContext
    } catch (err) {
      setError("Username atau password salah."); // Tampilkan error
    }
  };
  // --- AKHIR STATE BARU ---

  return (
    <div className="flex min-h-screen bg-white">
      {/* Kolom Kiri: Logo & Branding */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 lg:flex-2">
        <div className="text-center">
          {/* Ganti 'logo.svg' dengan path logo kamu */}
          <img
            src="/assets/images/logo.png"
            alt="Mandiri Steel Logo"
            className="mx-auto mb-4 w-24 h-24"
            style={{ color: goldColor }} // Jika logo adalah font/svg
          />
          <h1 className="text-4xl font-bold" style={{ color: goldColor }}>
            Mandiri Steel
          </h1>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex flex-1 flex-col justify-center px-4 ...">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            {/* Ganti 'logo.svg' dengan path logo kamu */}
            <img
              src="/assets/images/logo.png"
              alt="Mandiri Steel Logo"
              className="mb-4 h-12 w-auto"
              style={{ color: goldColor }}
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Log in to your account
            </h2>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    value={username} // Hubungkan ke state
                    onChange={(e) => setUsername(e.target.value)} // Hubungkan ke state
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm"
                    // Ganti 'focus:border-mustard' jika kamu sudah set di tailwind.config
                    style={{
                      borderColor: "#d1d5db",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = goldColor)}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password} // Hubungkan ke state
                    onChange={(e) => setPassword(e.target.value)} // Hubungkan ke state
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm"
                    style={{
                      borderColor: "#d1d5db",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = goldColor)}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>
              </div>

              {/* Tampilkan error jika ada */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    style={{ color: goldColor }}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium"
                    style={{ color: goldColor }}
                  >
                    Forgot password
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex w-full justify-center items-center
                    rounded-lg px-6 py-3
                    font-semibold text-white
                    shadow-md hover:shadow-xl
                    transition-all duration-200 ease-in-out
                    transform hover:-translate-y-0.5 active:translate-y-0
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  style={{ backgroundColor: goldColor }}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
            {/* --- AKHIR FORM DIUBAH --- */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
