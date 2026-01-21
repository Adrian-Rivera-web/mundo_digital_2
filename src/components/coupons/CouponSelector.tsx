import { useState, useEffect } from 'react';
import { Tag, Check, X, ChevronDown } from 'lucide-react';
import { CouponService } from '../../services/coupon.service';
import type { Coupon } from '../../types';

interface CouponSelectorProps {
    currentTotal: number;
    onSelectCoupon: (coupon: Coupon) => void;
    onRemoveCoupon: () => void;
    appliedCoupon: Coupon | null;
}

export const CouponSelector = ({ currentTotal, onSelectCoupon, onRemoveCoupon, appliedCoupon }: CouponSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    // Manual entry state
    const [manualCode, setManualCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setCoupons(CouponService.getAvailableCoupons());
    }, []);

    const handleManualSubmit = () => {
        setError('');
        const result = CouponService.validateCoupon(manualCode, currentTotal);
        if (result.valid && result.coupon) {
            onSelectCoupon(result.coupon);
            setManualCode('');
            setIsOpen(false);
        } else {
            setError(result.error || 'Cupón inválido');
        }
    };

    const handleSelect = (coupon: Coupon) => {
        // Validate min purchase
        if (coupon.minPurchase && currentTotal < coupon.minPurchase) {
            setError(`Monto mínimo: $${coupon.minPurchase.toLocaleString()}`);
            return;
        }

        onSelectCoupon(coupon);
        setIsOpen(false);
        setError('');
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 font-medium text-gray-800 dark:text-gray-200">
                <Tag size={18} />
                <span>Cupón de Descuento</span>
            </div>

            {appliedCoupon ? (
                <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400 font-mono tracking-wide">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600 dark:text-green-500">{appliedCoupon.description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onRemoveCoupon}
                        className="p-1 rounded-full text-green-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Remover cupón"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Toggle Button for Dropdown */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        <span>Ver mis cupones disponibles ({coupons.length})</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Content */}
                    {isOpen && (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                            {/* List of Coupons */}
                            {coupons.map((coupon) => {
                                const isEligible = !coupon.minPurchase || currentTotal >= coupon.minPurchase;
                                return (
                                    <button
                                        key={coupon.code}
                                        type="button"
                                        onClick={() => handleSelect(coupon)}
                                        disabled={!isEligible}
                                        className={`w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${!isEligible ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900/30' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-bold text-gray-800 dark:text-gray-200 block text-xs font-mono">{coupon.code}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">{coupon.description}</span>
                                            </div>
                                            {isEligible ? (
                                                <div className="text-blue-600 dark:text-blue-400">
                                                    <Check size={14} />
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-red-500">Min: ${coupon.minPurchase?.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}

                            {/* Manual Entry Fallback */}
                            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-500 mb-2">¿Tienes otro código?</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                        placeholder="CÓDIGO"
                                        className="flex-1 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleManualSubmit}
                                        className="text-xs bg-gray-900 text-white px-3 py-1 rounded hover:bg-black"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>
            )}
        </div>
    );
};
