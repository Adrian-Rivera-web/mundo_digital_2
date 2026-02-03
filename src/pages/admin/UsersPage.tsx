import { useState, useEffect } from 'react';
import { Search, UserPlus, Eye, Shield, Trash2, X, ShoppingBag, Monitor } from 'lucide-react';
import type { User } from '../../types';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';


export const UsersPage = () => {
    // RUT Validation Helpers (Simplified for Admin use)
    const formatRut = (rut: string) => {
        const clean = rut.replace(/[^0-9kK]+/g, '').toUpperCase();
        if (clean.length <= 1) return clean;
        const body = clean.slice(0, -1);
        const dv = clean.slice(-1);
        let formattedBody = '';
        for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
            formattedBody = body[i] + (j > 0 && j % 3 === 0 ? '.' : '') + formattedBody;
        }
        return `${formattedBody}-${dv}`;
    };

    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserHistory, setSelectedUserHistory] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'CLIENT' as const,
        password: '',
        rut: '',
        phone: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await UserService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
            // Fallback to empty or show error
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // We use AuthService.register because it handles password hashing etc (via backend register endpoint)
            // But AuthService.register logs us in automatically usually in context.
            // We should check if we can use a direct service call or if we need a specific 'admin create user' endpoint.
            // Re-using AuthService.register might change the CURRENT user session in some implementations.
            // Let's check AuthService.register implementation.
            // It calls /auth/register and then setUser(response). 
            // BAD: Using context register will log out the admin.
            // We need to use AuthService.register STATICALLY without context side effects, or a new endpoint.
            // AuthService.register returns the user but also has side effects in Context? 
            // No, AuthService.register in `auth.service.ts` is static. 
            // `useAuth().register` WRAPS it and updates state.
            // So we should use `AuthService` directly here, NOT `useAuth`.

            await AuthService.register(newUser.name, newUser.email, newUser.rut, newUser.phone, newUser.password);
            // Verify if backend allows duplicate emails (it throws 400).

            await loadUsers(); // Refresh list
            setShowCreateModal(false);
            setNewUser({ name: '', email: '', role: 'CLIENT', password: '', rut: '', phone: '' });
            alert('Usuario creado correctamente');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al crear usuario');
        }
    };

    const toggleRole = async (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        if (user.role === 'SUPERADMIN') return;

        const newRole = user.role === 'ADMIN' ? 'CLIENT' : 'ADMIN';
        try {
            await UserService.updateRole(userId, newRole);
            loadUsers();
        } catch (error) {
            console.error("Error updating role", error);
            alert("No se pudo actualizar el rol");
        }
    };

    const deleteUser = async (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user?.role === 'SUPERADMIN') {
            alert('No se puede eliminar al Super Admin.');
            return;
        }
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await UserService.delete(userId);
                loadUsers();
            } catch (error) {
                console.error("Error deleting user", error);
                alert("Error al eliminar usuario");
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar usuarios por nombre o email..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700/50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all sm:text-sm text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                    <span className="text-blue-700 dark:text-blue-400 font-bold uppercase">{user.name.charAt(0)}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleRole(user.id)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border transition-all ${user.role === 'ADMIN'
                                                    ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
                                                    : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                                    }`}
                                            >
                                                <Shield className="h-3 w-3 mr-1" /> {user.role}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => setSelectedUserHistory(user.id)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                                    <Eye className="h-4 w-4 mr-1" /> Historial
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Historial de Compras */}
            {selectedUserHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase">Historial de Compras</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Usuario: {users.find(u => u.id === selectedUserHistory)?.name}</p>
                            </div>
                            <button onClick={() => setSelectedUserHistory(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {(() => {
                                const ordersStr = localStorage.getItem('mundo_digital_orders');
                                const allOrders: any[] = ordersStr ? JSON.parse(ordersStr) : [];
                                const userOrders = allOrders.filter(o => o.userId === selectedUserHistory);

                                if (userOrders.length === 0) {
                                    return (
                                        <div className="text-center py-20">
                                            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-bold italic">Este usuario no ha realizado ninguna compra aún.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="space-y-8">
                                        {userOrders.map((order) => (
                                            <div key={order.id} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Pedido #{order.id.substring(0, 8)}</span>
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-3">
                                                                    <Monitor className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Cant: {item.quantity} x ${item.price.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-black text-gray-900 dark:text-white">${(item.price * item.quantity).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center font-black">
                                                        <span className="text-xs uppercase text-gray-400">Total del Pedido</span>
                                                        <span className="text-blue-600 dark:text-blue-400 text-lg">${order.total.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setSelectedUserHistory(null)}
                                className="w-full py-3 bg-gray-900 dark:bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-black dark:hover:bg-blue-700 transition-all"
                            >
                                Cerrar Historial
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Creación de Usuario */}
            {
                showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase">Nuevo Usuario</h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Nombre Completo</label>
                                    <input
                                        required
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">RUT</label>
                                        <input
                                            required
                                            type="text"
                                            value={newUser.rut}
                                            onChange={(e) => setNewUser({ ...newUser, rut: formatRut(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="12.345.678-9"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Teléfono</label>
                                        <input
                                            type="text"
                                            value={newUser.phone}
                                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="9 1234 5678"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Correo Electrónico</label>
                                    <input
                                        required
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="juan@ejemplo.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Contraseña</label>
                                    <input
                                        required
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="********"
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Rol de Acceso</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="CLIENT">Cliente (Solo Compras)</option>
                                        <option value="ADMIN">Administrador (Acceso Panel)</option>
                                    </select>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                                    >
                                        Crear Usuario
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="w-full py-3 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold uppercase tracking-widest rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};


