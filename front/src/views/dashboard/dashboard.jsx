import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Vote,
  UserPlus,
  BarChart3,
  Users,
  User,
  Award,
  Home
} from "lucide-react";
import VoterDashboard from "./VoterDashboard";
import CandidateDashboard from "./CandidateDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("inicio");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/new-inntech/login");
      return;
    }
    setUser(JSON.parse(userInfo));
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "estadisticas") {
      const fetchStatistics = async () => {
        setLoadingStats(true);
        try {
          const res = await fetch("http://localhost:9999/api/get/statistics");
          if (!res.ok) throw new Error("Error al obtener estadísticas");
          const data = await res.json();
          console.log("📊 Datos de estadísticas recibidos:", data);
          setStats(data);
        } catch (err) {
          setErrorStats(err.message);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStatistics();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("authToken");
    navigate("/new-inntech/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "votar":
        return <VoterDashboard />;
      case "candidatos":
        return user.role === "admin" ? <AdminDashboard /> : null;
      case "estadisticas":
        return (
          <div>
            {loadingStats && <p className="text-gray-600">Cargando estadísticas...</p>}
            {errorStats && <p className="text-red-500">{errorStats}</p>}
            {stats ? (
              <div>
                {/* Resumen general */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
                    <p className="font-medium">
                      🧑‍🤝‍🧑 Total de votantes registrados:{" "}
                      <span className="font-bold">{stats.total_voters}</span>
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
                    <p className="font-medium">
                      🗳️ Total de votos emitidos:{" "}
                      <span className="font-bold">{stats.total_votes}</span>
                    </p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 p-4 rounded-lg shadow">
                    <p className="font-medium">
                      🏛️ Total de candidatos:{" "}
                      <span className="font-bold">{stats.total_candidates}</span>
                    </p>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow">
                    <p className="font-medium">
                      📊 Tasa de participación:{" "}
                      <span className="font-bold">{stats.participation_rate}</span>
                    </p>
                  </div>
                </div>

                {/* Tabla de candidatos */}
                <table className="w-full border border-gray-300 rounded-lg shadow">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 text-left">Candidato</th>
                      <th className="p-3 text-left">Partido</th>
                      <th className="p-3 text-left">Votos</th>
                      <th className="p-3 text-left">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(stats.votes_per_candidate) && stats.votes_per_candidate.length > 0 ? (
                      stats.votes_per_candidate.map((c) => {
                        const porcentaje =
                          stats.total_votes > 0 ? (c.voteCount / stats.total_votes) * 100 : 0;
                        return (
                          <tr key={c._id} className="border-t">
                            <td className="p-3">{c.candidateName}</td>
                            <td className="p-3">{c.candidateParty}</td>
                            <td className="p-3">{c.voteCount}</td>
                            <td className="p-3">{porcentaje.toFixed(2)}%</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-3 text-center text-gray-500">
                          No hay datos de candidatos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              !loadingStats && <p className="text-gray-500">No hay estadísticas disponibles.</p>
            )}
          </div>

        );
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bienvenido, {user.name}!
            </h2>
            <p className="text-gray-600">
              Selecciona una opción del menú para comenzar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Sistema de Votación</h1>
          </div>

          <div className="mb-6 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("inicio")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "inicio"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </button>

            {/* Opción para Votantes */}
            {user.role === "voter" && (
              <button
                onClick={() => setActiveTab("votar")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "votar"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                <Vote className="w-5 h-5" />
                <span>Votar</span>
              </button>
            )}

            {/* Opción para Candidatos */}
            {user.role === "candidate" && (
              <button
                onClick={() => setActiveTab("estadisticas")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "estadisticas"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Mis Votos</span>
              </button>
            )}

            {/* Opciones para Admin */}
            {user.role === "admin" && (
              <>
                <button
                  onClick={() => setActiveTab("votar")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "votar"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                  <Vote className="w-5 h-5" />
                  <span>Votar</span>
                </button>

                <button
                  onClick={() => setActiveTab("candidatos")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "candidatos"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Gestionar Usuarios</span>
                </button>

                <button
                  onClick={() => setActiveTab("estadisticas")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "estadisticas"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Estadísticas</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === "inicio" && "Dashboard Principal"}
              {activeTab === "votar" && "Sistema de Votación"}
              {activeTab === "candidatos" && "Gestión de Candidatos"}
              {activeTab === "estadisticas" && "Estadísticas y Resultados"}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === "inicio" && "Resumen general del sistema"}
              {activeTab === "votar" && "Elige tu candidato preferido"}
              {activeTab === "candidatos" && "Administra los candidatos del sistema"}
              {activeTab === "estadisticas" && "Consulta los resultados de las votaciones"}
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            {renderDashboardContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;