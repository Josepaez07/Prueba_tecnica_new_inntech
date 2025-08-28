import { useState, useEffect } from "react";
import { UserPlus, Edit, Trash2, Loader } from "lucide-react";
import Swal from "sweetalert2";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [search, setSearch] = useState(""); 
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        party: "",
        password: "",
        role: "candidate"
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:9999/api/get-all/user", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                    }
                });

                if (!res.ok) throw new Error("Error al obtener usuarios");

                const data = await res.json();
                setAllUsers(data);
                setUsers(data); // 🔹 Mostrar todos los usuarios
            } catch (error) {
                console.error("Error fetching users:", error);
                Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setUsers(filtered);
    }, [search, allUsers]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAdding(true);

        try {
            if (!newUser.name || !newUser.email || !newUser.password) {
                throw new Error("Todos los campos son obligatorios");
            }

            if (newUser.password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres");
            }

            const response = await fetch("http://localhost:9999/api/create/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify(newUser)
            });

            const data = await response.json();

            if (response.ok) {
                setAllUsers([...allUsers, data]);
                Swal.fire({
                    title: "¡Usuario agregado!",
                    text: "El usuario fue registrado exitosamente.",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });

                setNewUser({
                    name: "",
                    email: "",
                    party: "",
                    password: "",
                    role: "candidate"
                });
            } else {
                throw new Error(data.message || data.error || "No se pudo agregar el usuario");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const { value: confirm } = await Swal.fire({
            title: "¿Eliminar usuario?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280"
        });

        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:9999/api/delete/user/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (res.ok) {
                const updatedAllUsers = allUsers.filter(u => u._id !== userId);
                setAllUsers(updatedAllUsers);
                Swal.fire({
                    title: "Eliminado!",
                    text: "El usuario ha sido eliminado.",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || errorData.error || "No se pudo eliminar el usuario");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Cargando usuarios...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Gestión de Usuarios
                </h2>
                <p className="text-gray-600">
                    Administra los usuarios registrados en el sistema
                </p>
            </div>

            {/* Formulario para agregar usuario */}
            <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                    <UserPlus className="w-5 h-5 inline-block mr-2" />
                    Agregar Nuevo Usuario
                </h3>

                <form onSubmit={handleAddUser} className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                        <input
                            type="text"
                            placeholder="Ej: Juan Pérez"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={adding}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                        <input
                            type="email"
                            placeholder="Ej: usuario@ejemplo.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={adding}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Partido político *</label>
                        <input
                            type="text"
                            placeholder="Ej: Partido Verde"
                            value={newUser.party}
                            onChange={(e) => setNewUser({ ...newUser, party: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={adding}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={adding}
                        >
                            <option value="" disabled>Selecciona un rol</option>
                            <option value="voter">Votante</option>
                            <option value="candidate">Candidato</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña temporal *</label>
                        <input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            minLength={6}
                            disabled={adding}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={adding}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {adding ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin inline-block mr-2" />
                                    Agregando...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 inline-block mr-2" />
                                    Agregar Usuario
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Buscador */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Lista de usuarios */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800 text-lg">Usuarios Registrados</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {users.length} usuarios
                    </span>
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay usuarios registrados</p>
                        <p className="text-sm">Agrega el primer usuario usando el formulario superior</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Partido</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rol</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.party || "Sin partido"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.role}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
