import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../hooks/useCartStore';
import { useAuth } from '../../context/AuthContext';
import { OrderService } from '../../services/order.service';
import { CreditCard, Truck, Store } from 'lucide-react';
import { LoyaltyService } from '../../services/loyalty.service';
import { CouponService } from '../../services/coupon.service';
import type { Coupon } from '../../types';
import { CouponSelector } from '../../components/coupons/CouponSelector';
import { MundoBitIcon } from '../../components/ui/MundoBitIcon';

const checkoutSchema = z.object({
    shippingType: z.enum(['PICKUP', 'DELIVERY']),
    rut: z.string().min(8, "RUT es obligatorio"),
    phone: z.string().min(9, "Teléfono es obligatorio"),
    address: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
}).refine(data => {
    if (data.shippingType === 'DELIVERY') {
        return !!data.address && !!data.city && !!data.zip;
    }
    return true;
}, {
    message: "La dirección es obligatoria para envío a domicilio",
    path: ["address"]
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
    const { items, getTotal, clearCart } = useCartStore();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [shippingCost, setShippingCost] = useState(0);
    const [bitsToRedeem, setBitsToRedeem] = useState(0); // Bits to redeem

    // Coupon State
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            shippingType: 'PICKUP',
            rut: user?.rut || '',
            phone: user?.phone || '',
            address: user?.address || '',
        }
    });

    const shippingType = watch('shippingType');

    // Update shipping cost when type changes
    if (shippingType === 'DELIVERY' && shippingCost !== 4000) setShippingCost(4000);
    if (shippingType === 'PICKUP' && shippingCost !== 0) setShippingCost(0);

    const subtotal = getTotal();

    // Coupon Logic
    const discountFromCoupon = appliedCoupon ? CouponService.calculateDiscount(appliedCoupon, subtotal) : 0;
    const subtotalAfterCoupon = subtotal - discountFromCoupon;

    const totalBeforeBits = subtotalAfterCoupon + shippingCost;

    // Loyalty Calculations
    // Note: Bits redemption cap applies to the subtotal AFTER coupon
    const userBits = user?.bits || 0;
    const maxRedeemableForOrder = LoyaltyService.calculateMaxRedemption(userBits, subtotalAfterCoupon);
    const discountFromBits = Math.min(bitsToRedeem, maxRedeemableForOrder); // Ensure valid if totals change

    const finalTotal = totalBeforeBits - discountFromBits;
    const earnedBits = LoyaltyService.calculateBitsEarned(subtotalAfterCoupon); // Earn based on what you pay for products

    const handleSelectCoupon = (coupon: Coupon) => {
        setAppliedCoupon(coupon);
        // Reset bits if necessary to prevent over-redemption issues
        setBitsToRedeem(0);
    };

    const onSubmit = async (data: CheckoutFormData) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const order = await OrderService.createOrder(
            user.id,
            items,
            finalTotal,
            data,
            {
                redeemed: discountFromBits,
                earned: earnedBits
            }
        );

        clearCart();
        navigate(`/order-success/${order.id}`);
    };

    if (items.length === 0) {
        return <div className="p-8 text-center text-gray-500">No hay items en el carrito para procesar.</div>;
    }

    if (!user) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Inicia sesión para continuar</h2>
                <p className="mb-4">Necesitas una cuenta para procesar tu pedido.</p>
                <div className="space-x-4">
                    <Link to="/login" className="text-blue-600 font-bold">Iniciar Sesión</Link>
                    <Link to="/register" className="text-green-600 font-bold">Registrarse</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-gray-100">Finalizar Compra</h1>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 mb-6">
                            <div>
                                <label htmlFor="rut" className="block text-sm font-medium text-gray-700 dark:text-gray-300">RUT</label>
                                <div className="mt-1">
                                    <input type="text" id="rut" {...register('rut')} className="block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 dark:bg-gray-800 dark:text-white" />
                                    {errors.rut && <p className="mt-1 text-sm text-red-600">{errors.rut.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                                <div className="mt-1">
                                    <input type="tel" id="phone" {...register('phone')} className="block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 dark:bg-gray-800 dark:text-white" />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                                </div>
                            </div>
                        </div>

                        <section aria-labelledby="shipping-heading">
                            <h2 id="shipping-heading" className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                Método de Entrega
                            </h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <label className={`
                        relative border rounded-lg p-4 flex cursor-pointer focus:outline-none dark:bg-gray-800
                        ${shippingType === 'PICKUP' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}
                    `}>
                                    <input
                                        type="radio"
                                        {...register('shippingType')}
                                        value="PICKUP"
                                        className="sr-only"
                                    />
                                    <div className="flex-1 flex">
                                        <div className="flex flex-col">
                                            <span className={`block text-sm font-medium ${shippingType === 'PICKUP' ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-gray-300'}`}>
                                                Retiro en Sucursal
                                            </span>
                                            <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Store className="h-4 w-4 mr-1" /> Gratis
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${shippingType === 'PICKUP' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {shippingType === 'PICKUP' && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                </label>

                                <label className={`
                        relative border rounded-lg p-4 flex cursor-pointer focus:outline-none dark:bg-gray-800
                        ${shippingType === 'DELIVERY' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}
                    `}>
                                    <input
                                        type="radio"
                                        {...register('shippingType')}
                                        value="DELIVERY"
                                        className="sr-only"
                                    />
                                    <div className="flex-1 flex">
                                        <div className="flex flex-col">
                                            <span className={`block text-sm font-medium ${shippingType === 'DELIVERY' ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-gray-300'}`}>
                                                Envío a Domicilio
                                            </span>
                                            <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Truck className="h-4 w-4 mr-1" /> $4,000.00
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${shippingType === 'DELIVERY' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {shippingType === 'DELIVERY' && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                </label>
                            </div>
                        </section>

                        {shippingType === 'DELIVERY' && (
                            <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label>
                                        <div className="mt-1">
                                            <input type="text" id="address" {...register('address')} className="block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-white" />
                                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
                                        <div className="mt-1">
                                            <input type="text" id="city" {...register('city')} className="block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-white" />
                                            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Código Postal</label>
                                        <div className="mt-1">
                                            <input type="text" id="zip" {...register('zip')} className="block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-white" />
                                            {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="mt-10 lg:mt-0">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Resumen del Pedido</h2>
                    <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {items.map((item) => (
                                <li key={item.id} className="flex py-6 px-4 sm:px-6">
                                    <div className="flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-center object-cover" />
                                    </div>
                                    <div className="ml-6 flex-1 flex flex-col">
                                        <div className="flex">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-800">
                                                    {item.name}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-2 flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {item.quantity} x ${(item.discountPrice || item.price).toLocaleString()}
                                                </p>
                                                {item.discountPrice && (
                                                    <p className="text-xs text-gray-400 line-through">
                                                        Original: ${item.price.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                                                ${((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Coupon Section */}
                        <CouponSelector
                            currentTotal={subtotal}
                            appliedCoupon={appliedCoupon}
                            onSelectCoupon={handleSelectCoupon}
                            onRemoveCoupon={() => setAppliedCoupon(null)}
                        />

                        {/* Loyalty Redemption Section */}
                        {userBits > 0 && maxRedeemableForOrder > 0 && (
                            <div className="p-4 bg-purple-50 dark:bg-gray-900/50 border-t border-b border-purple-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2 font-medium text-purple-800 dark:text-purple-400">
                                    <MundoBitIcon size={18} />
                                    <span>Mundo Bits</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span>Saldo disponible:</span>
                                    <span className="font-bold">{userBits} Bits</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxRedeemableForOrder}
                                        step="100"
                                        value={discountFromBits}
                                        onChange={(e) => setBitsToRedeem(parseInt(e.target.value))}
                                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="font-bold text-purple-700 dark:text-purple-400 w-16 text-right">
                                        {discountFromBits}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Puedes usar hasta el 50% de valor del carrito ({maxRedeemableForOrder} bits).
                                </p>
                            </div>
                        )}

                        <dl className="border-t border-gray-200 dark:border-gray-700 py-6 px-4 space-y-6 sm:px-6">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600 dark:text-gray-400">Subtotal productos</dt>
                                <dd className="text-sm font-bold text-gray-900 dark:text-white">${subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</dd>
                            </div>
                            {items.some(i => i.discountPrice) && (
                                <div className="flex items-center justify-between text-green-600 font-medium">
                                    <dt className="text-sm italic">Descuento aplicado</dt>
                                    <dd className="text-sm">-{(items.reduce((acc, i) => acc + (i.discountPrice ? (i.price - i.discountPrice) * i.quantity : 0), 0)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</dd>
                                </div>
                            )}

                            {discountFromCoupon > 0 && (
                                <div className="flex items-center justify-between text-green-600 font-medium">
                                    <dt className="text-sm">Cupón ({appliedCoupon?.code})</dt>
                                    <dd className="text-sm">-${discountFromCoupon.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</dd>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 font-medium">
                                <dt className="text-sm">Bits canjeados</dt>
                                <dd className="text-sm">-${discountFromBits.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600 dark:text-gray-400">Envío</dt>
                                <dd className="text-sm font-medium text-gray-900 dark:text-white">${shippingCost.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                                <dt className="text-base font-medium text-gray-900 dark:text-white">Total a Pagar</dt>
                                <dd className="text-xl font-bold text-gray-900 dark:text-white">${finalTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</dd>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
                                <dt>Ganarás</dt>
                                <dd className="font-bold text-purple-600">+{earnedBits} Bits</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <p>El pago se coordina manualmente post-pedido.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
