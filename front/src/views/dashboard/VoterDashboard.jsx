import { useState, useEffect } from "react";
import { Users, CheckCircle, Loader, RefreshCw, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const VoterDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [userId, setUserId] = useState(null);
    const [dbHasVoted, setDbHasVoted] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo?._id) {
            setUserId(userInfo._id);
            setHasVoted(userInfo.has_voted || false);
            checkRealVoteStatus(userInfo._id);
        }
        fetchCandidates();
    }, []);

    const checkRealVoteStatus = async (userId) => {
        try {
            const response = await fetch(`http://localhost:9999/api/get/user/${userId}`);
            if (response.ok) {
                const userData = await response.json();
                setDbHasVoted(userData.has_voted || false);
                
                // Sincronizar con estado local si hay discrepancia
                if (userData.has_voted !== hasVoted) {
                    setHasVoted(userData.has_voted);
                    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                    localStorage.setItem("userInfo", JSON.stringify({
                        ...userInfo,
                        has_voted: userData.has_voted
                    }));
                }
            }
        } catch (error) {
            console.error("Error checking real vote status:", error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const res = await fetch("http://localhost:9999/api/get-all/user");
            if (!res.ok) throw new Error("Error al cargar candidatos");
            const data = await res.json();
            const candidateUsers = data.filter(u => u.role === "candidate");
            setCandidates(candidateUsers);
        } catch (error) {
            console.error("Error fetching candidates:", error);
            Swal.fire("Error", "No se pudieron cargar los candidatos", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (candidateId) => {
        if (!userId) {
            Swal.fire("Error", "Usuario no identificado", "error");
            return;
        }

        // Verificar estado REAL en la base de datos
        try {
            const userRes = await fetch(`http://localhost:9999/api/get/user/${userId}`);
            const userData = await userRes.json();
            
            if (userData.has_voted) {
                Swal.fire("Ya votaste", "No puedes votar nuevamente", "warning");
                setHasVoted(true);
                setDbHasVoted(true);
                return;
            }
        } catch (error) {
            console.error("Error verificando estado:", error);
            Swal.fire("Error", "No se pudo verificar tu estado", "error");
            return;
        }

        const { value: confirm } = await Swal.fire({
            title: "¿Confirmar voto?",
            text: "Esta acción no se puede deshacer.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, votar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm) return;

        setVoting(true);

        try {
            const response = await fetch("http://localhost:9999/api/create/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    voter_id: userId,
                    candidate_id: candidateId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire("¡Éxito!", "Voto registrado correctamente", "success");
                setHasVoted(true);
                setDbHasVoted(true);
                
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                localStorage.setItem("userInfo", JSON.stringify({
                    ...userInfo,
                    has_voted: true
                }));
                
                fetchCandidates();
            } else {
                throw new Error(data.error || data.message || "Error al votar");
            }
        } catch (error) {
            console.error("Error voting:", error);

            // Si el error es por voto duplicado, actualizar estado
            if (error.message.includes("ya ha emitido")) {
                setHasVoted(true);
                setDbHasVoted(true);
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                localStorage.setItem("userInfo", JSON.stringify({
                    ...userInfo,
                    has_voted: true
                }));
            }

            Swal.fire("Error", error.message, "error");
        } finally {
            setVoting(false);
        }
    };

    const debugVoteStatus = async () => {
        try {
            const [userRes, votesRes] = await Promise.all([
                fetch(`http://localhost:9999/api/get/user/${userId}`),
                fetch("http://localhost:9999/api/get-all/vote")
            ]);

            const userData = await userRes.json();
            const votesData = await votesRes.json();

            const userVotes = votesData.votes ? votesData.votes.filter(vote => 
                vote.voter && vote.voter._id === userId
            ) : [];

            Swal.fire({
                title: "Estado Real - Debug",
                html: `
                    <div style="text-align: left; font-size: 14px;">
                        <p><strong>Usuario:</strong> ${userData.name}</p>
                        <p><strong>ID:</strong> ${userData._id}</p>
                        <p><strong>has_voted (DB):</strong> <span style="color: ${userData.has_voted ? 'red' : 'green'}">${userData.has_voted ? 'SÍ' : 'NO'}</span></p>
                        <p><strong>has_voted (Local):</strong> <span style="color: ${hasVoted ? 'red' : 'green'}">${hasVoted ? 'SÍ' : 'NO'}</span></p>
                        <p><strong>Votos en DB:</strong> ${userVotes.length}</p>
                        ${userVotes.length > 0 ? `
                            <p><strong>Último voto:</strong> ${new Date(userVotes[0].createdAt).toLocaleString()}</p>
                            <p><strong>Candidato:</strong> ${userVotes[0].candidate?.name}</p>
                        ` : ''}
                        ${userVotes.length > 0 && !userData.has_voted ? 
                            '<p style="color: red; font-weight: bold;">⚠️ INCONSISTENCIA: Hay votos pero has_voted = false</p>' : ''}
                    </div>
                `,
                icon: "info",
                width: 600
            });

        } catch (error) {
            console.error("Debug error:", error);
        }
    };

    const cleanDuplicateVotes = async () => {
        const { value: confirm } = await Swal.fire({
            title: "¿Limpiar votos duplicados?",
            text: "Esta acción eliminará todos los votos duplicados de la base de datos",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, limpiar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444"
        });

        if (!confirm) return;

        try {
            const votesRes = await fetch("http://localhost:9999/api/get-all/vote");
            const votesData = await votesRes.json();
            
            const userVotes = votesData.votes ? votesData.votes.filter(vote => 
                vote.voter && vote.voter._id === userId
            ) : [];

            if (userVotes.length === 0) {
                Swal.fire("Info", "No hay votos duplicados para limpiar", "info");
                return;
            }

            // Eliminar todos los votos
            for (const vote of userVotes) {
                await fetch(`http://localhost:9999/api/delete/vote/${vote._id}`, {
                    method: "DELETE"
                });
            }

            // Resetear estado del usuario
            await fetch(`http://localhost:9999/api/update/user/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ has_voted: false })
            });

            Swal.fire("¡Limpiado!", `Se eliminaron ${userVotes.length} votos duplicados`, "success");
            
            // Actualizar estado local
            setHasVoted(false);
            setDbHasVoted(false);
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            localStorage.setItem("userInfo", JSON.stringify({
                ...userInfo,
                has_voted: false
            }));

        } catch (error) {
            console.error("Error cleaning duplicates:", error);
            Swal.fire("Error", "No se pudieron limpiar los votos duplicados", "error");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Cargando...</p>
            </div>
        );
    }

    if (hasVoted || dbHasVoted) {
        return (
            <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">¡Ya has votado!</h3>
                <p className="text-gray-600 mb-4">Tu voto ha sido registrado.</p>                
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Elige tu candidato</h2>
                    <p className="text-gray-600">Selecciona el candidato de tu preferencia</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map(candidate => (
                    <div key={candidate._id} className="border rounded-lg p-6 text-center bg-white shadow-sm">
                        <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-800">{candidate.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{candidate.party}</p>
                        <p className="text-xs text-gray-500 mb-4">{candidate.votes || 0} votos</p>
                        
                        <button
                            onClick={() => handleVote(candidate._id)}
                            disabled={voting}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            {voting ? "Votando..." : "Votar"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VoterDashboard;