import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Scissors, UserPlus } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:9999/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userInfo", JSON.stringify({
          _id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          has_voted: data.user.has_voted ?? false // por si acaso
        }));
        navigate("/new-inntech/dashboard");
      }


    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error de inicio de sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-200 to-gray-200 flex items-center justify-center p-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">

          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Sistema de Votación
            </h1>
            <p className="text-gray-900">Inicia sesión en tu cuenta</p>
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Formulario de login */}
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-black/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400">@</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-black/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Tu contraseña"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">¿No tienes cuenta?</span>
            </div>
          </div>

          {/* Botón de crear cuenta */}
          <Link
            to="/new-inntech/register"
            className="w-full flex items-center justify-center gap-2 bg-blue/10 text-black py-3 px-4 rounded-lg hover:bg-gray/20 border border-black/20 transition-all duration-200 font-medium"
          >
            <UserPlus className="w-5 h-5" />
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;