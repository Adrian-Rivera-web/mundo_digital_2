import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoyaltyDashboard } from '../../components/loyalty/LoyaltyDashboard';
import { CouponList } from '../../components/coupons/CouponList';
import { User, Mail, Phone, CreditCard, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { OrderService } from '../../services/order.service';
import type { Order } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProfilePage = () => {
    const { user, refreshUser } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Refresh user data on mount to get latest bits
    useEffect(() => {
        refreshUser();
    }, []);

    // Fetch Orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.id) {
                const userOrders = await OrderService.getOrdersByUser(user.id);
                // Sort by newest first
                setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [user?.id]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Mi Perfil</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Loyalty Dashboard & Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Loyalty Dashboard */}
                    <LoyaltyDashboard user={user} />

                    {/* Coupons List */}
                    <CouponList />

                    {/* Personal Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Datos Personales
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                <User size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Nombre Completo</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                <Mail size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Correo Electrónico</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            {user.rut && (
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <CreditCard size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-400">RUT</p>
                                        <p className="font-medium">{user.rut}</p>
                                    </div>
                                </div>
                            )}

                            {user.phone && (
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <Phone size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-400">Teléfono</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-blue-600" />
                            Últimas Compras
                        </h2>

                        {loadingOrders ? (
                            <div className="flex-1 flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2">
                                {orders.map(order => (
                                    <div key={order.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                                #{order.id}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            <Calendar size={14} />
                                            {format(new Date(order.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">{order.items.length} items</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    ${order.total.toLocaleString('es-CL')}
                                                </p>
                                                {order.redeemedBits && order.redeemedBits > 0 && (
                                                    <p className="text-xs text-purple-600 font-medium">
                                                        -{order.redeemedBits} Bits usados
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 text-gray-500 dark:text-gray-400">
                                <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="mb-2">No tienes compras recientes.</p>
                                <p className="text-sm text-gray-400 mb-6">¡Explora nuestro catálogo y acumula Bits!</p>
                                <Link to="/products" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    Ir a la tienda <ArrowRight size={16} className="ml-2" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
