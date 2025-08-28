import { useState, useEffect } from "react";
import { BarChart3, Vote, TrendingUp, Users, Target, Award, Calendar } from "lucide-react";

const CandidateDashboard = () => {
    const [candidate, setCandidate] = useState(null);
    const [stats, setStats] = useState({
        totalVotes: 0,
        position: 0,
        totalCandidates: 0,
        totalVoters: 0,
        participationRate: "0%",
        topCandidates: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 🔑 Recuperar info del usuario logueado
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    const candidateId = storedUser?._id;

    useEffect(() => {
        if (!candidateId) {
            setError("No se encontró el ID del candidato (revisa login/localStorage)");
            setLoading(false);
            return;
        }
        fetchCandidateData();
        fetchStats();
    }, [candidateId]);

    const fetchCandidateData = async () => {
        try {
            const response = await fetch(`http://localhost:9999/api/get/user/${candidateId}`);
            if (!response.ok) throw new Error('Error al cargar datos del candidato');
            const data = await response.json();
            setCandidate(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/get/statistics');
            if (!response.ok) throw new Error('Error al cargar estadísticas');
            const data = await response.json();
            setStats(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
        <div className={`bg-white rounded-lg p-6 shadow-md border-l-4 border-${color}-500`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    const ProgressBar = ({ percentage, color = "blue" }) => (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
                className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p>Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard del Candidato</h1>
                <p className="text-gray-600">Seguimiento de tu campaña electoral</p>
            </div>

            {/* Candidate Info */}
            {candidate && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                            <p className="text-blue-600 font-medium">{candidate.party}</p>
                            <p className="text-gray-600">Candidato registrado</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-blue-600">{candidate.votes || 0}</p>
                            <p className="text-sm text-gray-600">votos totales</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={Vote}
                    title="Total de Votos"
                    value={stats.totalVotes}
                    subtitle="Votos emitidos"
                    color="green"
                />
                <StatCard
                    icon={Award}
                    title="Posición Actual"
                    value={`#${stats.position}`}
                    subtitle={`de ${stats.totalCandidates} candidatos`}
                    color="yellow"
                />
                <StatCard
                    icon={Users}
                    title="Tasa de Participación"
                    value={stats.participationRate}
                    subtitle="del total de votantes"
                    color="blue"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Progreso de Campaña"
                    value={`${Math.min(100, Math.round((stats.totalVotes / (stats.totalVoters || 1)) * 100))}%`}
                    subtitle="meta de votos"
                    color="purple"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Votes Progress */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso de Votos</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Votos obtenidos</span>
                                <span>{candidate?.votes || 0} votos</span>
                            </div>
                            <ProgressBar
                                percentage={Math.min(100, ((candidate?.votes || 0) / (stats.totalVoters || 1)) * 100)}
                                color="blue"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Meta de campaña</span>
                                <span>{(stats.totalVoters || 0) * 0.6} votos (60%)</span>
                            </div>
                            <ProgressBar
                                percentage={Math.min(100, ((candidate?.votes || 0) / ((stats.totalVoters || 1) * 0.6)) * 100)}
                                color="green"
                            />
                        </div>
                    </div>
                </div>

                {/* Ranking */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking de Candidatos</h3>
                    <div className="space-y-3">
                        {stats.topCandidates && stats.topCandidates.slice(0, 5).map((cand, index) => (
                            <div key={cand._id || index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <div className="flex items-center">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                            index === 1 ? 'bg-gray-100 text-gray-600' :
                                                index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {index + 1}
                                    </span>
                                    <span className="ml-3 text-sm font-medium">{cand.name}</span>
                                </div>
                                <span className="text-sm font-semibold">{cand.votes} votos</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm">Campaña iniciada</span>
                        </div>
                        <span className="text-xs text-gray-500">Hace 15 días</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                        <div className="flex items-center">
                            <Target className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm">Primeros votos recibidos</span>
                        </div>
                        <span className="text-xs text-gray-500">Hace 10 días</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                        <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm">Crecimiento en votos</span>
                        </div>
                        <span className="text-xs text-gray-500">Hace 5 días</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;