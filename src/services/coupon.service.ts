import type { Coupon } from '../types';

const INITIAL_COUPONS: Coupon[] = [
    {
        code: 'BIENVENIDA-MD',
        description: '10% de descuento por bienvenida',
        discountType: 'PERCENTAGE',
        value: 10,
        minPurchase: 0,
        active: true,
        usedCount: 0
    },
    {
        code: 'GAMER2024',
        description: '5% extra en categoría Gaming',
        discountType: 'PERCENTAGE',
        value: 5,
        minPurchase: 50000,
        active: true,
        usedCount: 0
    },
    {
        code: 'VERANO5000',
        description: '$5.000 de descuento',
        discountType: 'FIXED',
        value: 5000,
        minPurchase: 30000,
        active: true,
        usedCount: 0
    }
];

export const CouponService = {
    validateCoupon: (code: string, cartTotal: number): { valid: boolean; coupon?: Coupon; error?: string } => {
        // In a real app, fetch from DB
        const coupon = INITIAL_COUPONS.find(c => c.code === code.toUpperCase());

        if (!coupon) {
            return { valid: false, error: 'Cupón no existe' };
        }

        if (!coupon.active) {
            return { valid: false, error: 'Cupón inactivo' };
        }

        if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
            return { valid: false, error: `Monto mínimo: $${coupon.minPurchase.toLocaleString()}` };
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return { valid: false, error: 'Cupón aguado' };
        }

        return { valid: true, coupon };
    },

    calculateDiscount: (coupon: Coupon, cartTotal: number): number => {
        if (coupon.discountType === 'PERCENTAGE') {
            return Math.floor(cartTotal * (coupon.value / 100));
        } else {
            return Math.min(coupon.value, cartTotal);
        }
    },

    getAvailableCoupons: (): Coupon[] => {
        return INITIAL_COUPONS.filter(c => c.active);
    }
};
