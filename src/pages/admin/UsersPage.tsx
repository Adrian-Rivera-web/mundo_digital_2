import { useState, useEffect } from 'react';
import { Search, UserPlus, Eye, Shield, Trash2, X, ShoppingBag, Monitor } from 'lucide-react';
import type { User } from '../../types';

export const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserHistory, setSelectedUserHistory] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'CLIENT' as const });

    useEffect(() => {
        const loadUsers = () => {
            const usersStr = localStorage.getItem('mundo_digital_users');
            if (usersStr) {
                setUsers(JSON.parse(usersStr));
            } else {
                // Initialize with some default users if empty (for demo/persistence)
                const defaults: User[] = [
                    {
                        id: '1',
                        name: 'Admin Mundo',
                        email: 'admin@mundodigital.com',
                        role: 'SUPERADMIN',
                        bits: 0,
                        totalBitsDetails: 0,
                        tier: 'BIT'
                    }
                ];
                setUsers(defaults);
                localStorage.setItem('mundo_digital_users', JSON.stringify(defaults));
            }
        };
        loadUsers();
    }, []);

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (users.some(u => u.email === newUser.email)) {
            alert('Este email ya está registrado.');
            return;
        }

        const userToAdd: User = {
            ...newUser,
            id: Math.random().toString(36).substr(2, 9),
            bits: 0,
            totalBitsDetails: 0,
            tier: 'BIT'
        };

        const updated = [...users, userToAdd];
        setUsers(updated);
        localStorage.setItem('mundo_digital_users', JSON.stringify(updated));
        setShowCreateModal(false);
        setNewUser({ name: '', email: '', role: 'CLIENT' });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleRole = (userId: string) => {
        const updated = users.map(u => {
            if (u.id === userId) {
                // Prevent toggling SUPERADMIN
                if (u.role === 'SUPERADMIN') return u;
                return { ...u, role: u.role === 'ADMIN' ? 'CLIENT' : 'ADMIN' } as User;
            }
            return u;
        });
        setUsers(updated);
        localStorage.setItem('mundo_digital_users', JSON.stringify(updated));
    };

    const deleteUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user?.role === 'SUPERADMIN') {
            alert('No se puede eliminar al Super Admin.');
            return;
        }
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            const updated = users.filter(u => u.id !== userId);
            setUsers(updated);
            localStorage.setItem('mundo_digital_users', JSON.stringify(updated));
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar usuarios por nombre o email..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all sm:text-sm text-gray-900"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                                                    <span className="text-blue-700 font-bold uppercase">{user.name.charAt(0)}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
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
                                                    className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 px-2 py-1 rounded">
                                                    <Eye className="h-4 w-4 mr-1" /> Historial
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase">Historial de Compras</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Usuario: {users.find(u => u.id === selectedUserHistory)?.name}</p>
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
                                            <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-100">
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Pedido #{order.id.substring(0, 8)}</span>
                                                    <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                                                                    <Monitor className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                                                    <p className="text-xs text-gray-500">Cant: {item.quantity} x ${item.price.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-black text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center font-black">
                                                        <span className="text-xs uppercase text-gray-400">Total del Pedido</span>
                                                        <span className="text-blue-600 text-lg">${order.total.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedUserHistory(null)}
                                className="w-full py-3 bg-gray-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                            >
                                Cerrar Historial
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Creación de Usuario */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-black text-gray-900 uppercase">Nuevo Usuario</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
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
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Correo Electrónico</label>
                                <input
                                    required
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Rol de Acceso</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
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
                                    className="w-full py-3 bg-white text-gray-500 font-bold uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


