import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Scissors, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "voter"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#10B981',
      background: '#1F2937',
      color: 'white',
      iconColor: '#10B981'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/new-inntech/login");
      }
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#EF4444',
      background: '#1F2937',
      color: 'white',
      iconColor: '#EF4444'
    });
  };

  const showWarningAlert = (message) => {
    Swal.fire({
      title: 'Advertencia',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#F59E0B',
      background: '#1F2937',
      color: 'white',
      iconColor: '#F59E0B'
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      showErrorAlert("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showErrorAlert("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    // Mostrar confirmación antes de registrar
    const { value: accept } = await Swal.fire({
      title: '¿Crear cuenta?',
      text: '¿Estás seguro de que quieres crear una cuenta con estos datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear cuenta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      background: '#1F2937',
      color: 'white',
      reverseButtons: true
    });

    if (!accept) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:9999/api/create/user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el registro");
      }

      // Registro exitoso
      showSuccessAlert("Cuenta creada exitosamente. Ya puedes iniciar sesión.");

    } catch (error) {
      console.error("Error en el registro:", error);
      
      // Mostrar alerta de error específica
      if (error.message.includes("email") || error.message.includes("correo")) {
        showErrorAlert("El correo electrónico ya está registrado. Por favor, usa otro email.");
      } else if (error.message.includes("password") || error.message.includes("contraseña")) {
        showErrorAlert("La contraseña no cumple con los requisitos mínimos.");
      } else {
        showErrorAlert(error.message || "Error al crear la cuenta. Por favor, intenta nuevamente.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar información sobre los roles
  const showRoleInfo = () => {
    Swal.fire({
      title: 'Tipos de Usuario',
      html: `
        <div class="text-left text-gray-300">
          <p class="mb-3"><strong>Votante:</strong> Puede participar en las votaciones y emitir su voto.</p>
          <p class="mb-3"><strong>Candidato:</strong> Puede ser votado y participar en elecciones.</p>
          <p class="text-sm text-gray-400">* Los candidatos requieren aprobación adicional.</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3B82F6',
      background: '#1F2937',
      color: 'white',
      iconColor: '#3B82F6'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-200 to-gray-200 flex items-center justify-center p-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Botón de volver */}
        <Link
          to="/new-inntech/login"
          className="absolute -top-16 left-0 flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al login
        </Link>

        <div className="bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
          
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-900">Únete a nuestra plataforma</p>
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Formulario de registro */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-black/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Tu nombre completo"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-black/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-black/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Mínimo 6 caracteres"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-black/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Repite tu contraseña"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 focus:ring-4 focus:ring-green-500/50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          {/* Términos y condiciones */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">
              Al crear una cuenta, aceptas nuestros{' '}
              <button
                type="button"
                onClick={() => showWarningAlert("Términos y condiciones de uso del sistema de votación.")}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Términos y Condiciones
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;