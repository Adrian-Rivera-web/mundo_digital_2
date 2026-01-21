import { useEffect, useState } from 'react';
import { Tag, Copy } from 'lucide-react';
import { CouponService } from '../../services/coupon.service';
import type { Coupon } from '../../types';

export const CouponList = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    useEffect(() => {
        // In a real app, we would fetch coupons specific to the user
        const available = CouponService.getAvailableCoupons();
        setCoupons(available);
    }, []);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        // Could add a toast here
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Tag size={20} className="text-blue-600" />
                Mis Cupones
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <div
                            key={coupon.code}
                            className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group relative"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg tracking-wider font-mono">
                                        {coupon.code}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {coupon.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                                            Activo
                                        </span>
                                        {coupon.minPurchase && (
                                            <span className="text-xs text-gray-400">
                                                Min. ${coupon.minPurchase.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(coupon.code)}
                                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="Copiar código"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Tag size={32} className="mx-auto mb-2 opacity-20" />
                        <p>No tienes cupones disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
