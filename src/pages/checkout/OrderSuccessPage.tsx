import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { OrderService } from '../../services/order.service';
import { CheckCircle, Copy, ShoppingBag, Truck, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Order } from '../../types';

export const OrderSuccessPage = () => {
    const { id } = useParams<{ id: string }>();
    const { refreshUser } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Refresh user bits/points immediately after order
        refreshUser();

        // Fire confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Fetch Order Details
        const fetchOrder = async () => {
            if (id) {
                const fetchedOrder = await OrderService.getOrderById(id);
                if (fetchedOrder) {
                    setOrder(fetchedOrder);
                }
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const bankInfo = {
        bank: "Banco Digital",
        account: "1234 5678 9012",
        clabe: "012345678901234567",
        name: "Mundo Digital S.A. de C.V."
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full">
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-bounce">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">¡Pedido Recibido!</h2>
                    <p className="text-lg text-gray-600">ID de Orden: <span className="font-mono font-bold text-blue-600">#{id?.slice(-8).toUpperCase()}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Order Summary */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Resumen de Compra</h3>

                        <div className="space-y-4">
                            {order?.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <ShoppingBag size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-700 font-medium">({item.quantity}) {item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">${((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${order?.total && typeof order.redeemedBits === 'number' ? (order.total + order.redeemedBits).toLocaleString() : order?.total.toLocaleString()}</span>
                            </div>

                            {order?.redeemedBits && order.redeemedBits > 0 ? (
                                <div className="flex justify-between text-purple-600 font-medium">
                                    <span>Bits Canjeados</span>
                                    <span>-${order.redeemedBits.toLocaleString()}</span>
                                </div>
                            ) : null}

                            <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t">
                                <span>Total</span>
                                <span>${order?.total.toLocaleString()}</span>
                            </div>
                            {order?.earnedBits ? (
                                <div className="flex justify-center mt-2 bg-purple-50 text-purple-700 py-1 rounded-lg text-xs font-bold">
                                    ✨ Has ganado +{order.earnedBits} Bits
                                </div>
                            ) : null}
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-gray-50 p-4 rounded-lg text-sm">
                            <h4 className="font-bold flex items-center mb-2 text-gray-700">
                                {order?.shippingType === 'DELIVERY' ? <Truck size={16} className="mr-2" /> : <MapPin size={16} className="mr-2" />}
                                {order?.shippingType === 'DELIVERY' ? 'Envío a Domicilio' : 'Retiro en Tienda'}
                            </h4>
                            <p className="text-gray-600">{order?.shippingAddress}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <h3 className="text-lg font-bold text-yellow-800 mb-2">Pendiente de Pago</h3>
                            <p className="text-xs text-yellow-700 mb-4">
                                Realiza la transferencia y envía el comprobante a <span className="font-bold">ventas@mundodigital.cl</span>.
                            </p>
                        </div>

                        <div className="space-y-3 font-mono text-sm bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Banco:</span>
                                <span className="font-bold">{bankInfo.bank}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Cuenta:</span>
                                <span className="font-bold">{bankInfo.account}</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-pointer hover:bg-white p-1 -mx-1 rounded transition-colors"
                                onClick={() => navigator.clipboard.writeText(bankInfo.clabe)}>
                                <span className="text-gray-500">CLABE:</span>
                                <span className="font-bold flex items-center">
                                    {bankInfo.clabe} <Copy className="h-3 w-3 ml-2 text-blue-500" />
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 mt-3 border-t border-dashed border-gray-300">
                                <span className="text-gray-500">Monto:</span>
                                <span className="font-bold text-lg text-blue-600">${order?.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link to="/" className="w-full sm:w-auto text-center px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Volver a la Tienda
                    </Link>
                </div>
            </div>
        </div>
    );
};
