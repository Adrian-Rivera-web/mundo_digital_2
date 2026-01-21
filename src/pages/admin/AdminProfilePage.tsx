import { useState } from 'react';
import { User as UserIcon, Mail, Shield, Save, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoyaltyDashboard } from '../../components/loyalty/LoyaltyDashboard';

export const AdminProfilePage = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            const usersStr = localStorage.getItem('mundo_digital_users');
            if (usersStr && user) {
                const users = JSON.parse(usersStr);
                const updatedUsers = users.map((u: any) =>
                    u.email === user.email ? { ...u, name } : u
                );
                localStorage.setItem('mundo_digital_users', JSON.stringify(updatedUsers));
                // En una app real, aquí llamaríamos a un servicio para actualizar los datos
                // y luego actualizaríamos el contexto de autenticación o forzaríamos un re-login.
                console.log('Perfil actualizado localmente en localStorage');
            }
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Configuración de Perfil</h1>
                {showSuccess && (
                    <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg animate-pulse">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Perfil actualizado con éxito
                    </div>
                )}
            </div>

            {user && <LoyaltyDashboard user={user} />}

            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32 relative">
                    <div className="absolute -bottom-12 left-8 border-4 border-white rounded-2xl bg-white shadow-lg">
                        <div className="h-24 w-24 rounded-xl bg-blue-50 flex items-center justify-center">
                            <UserIcon className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-16">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{user?.name}</h2>
                            <p className="text-gray-500 font-medium">{user?.email}</p>
                        </div>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-blue-600 text-white uppercase tracking-widest">
                            <Shield className="h-3 w-3 mr-1.5" /> {user?.role}
                        </span>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nombre de Usuario</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Correo Electrónico (No modificable)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    defaultValue={user?.email}
                                    className="block w-full pl-11 pr-4 py-3 border border-transparent bg-gray-50 text-gray-400 rounded-xl cursor-not-allowed font-medium"
                                    disabled
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Seguridad</label>
                            <button className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                <Lock className="h-4 w-4 mr-2" /> Cambiar Contraseña de Acceso
                            </button>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`w-full flex justify-center items-center px-6 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-all shadow-lg ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                        >
                            <Save className="h-5 w-5 mr-3" />
                            {isSaving ? 'Actualizando...' : 'Guardar Todos los Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
