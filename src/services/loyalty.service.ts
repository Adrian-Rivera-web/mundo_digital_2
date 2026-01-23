
export type Tier = 'BIT' | 'BYTE' | 'GIGA';

export const LOYALTY_RULES = {
    BITS_PER_CLP: 0.01, // 10 Bits per $1000 => 1 Bit per $100
    CLP_PER_BIT: 1,     // 1 Bit = $1 CLP
    MAX_REDEMPTION_PERCENTAGE: 0.5, // 50% max payment with bits
    TIERS: {
        BIT: { max: 5000, name: 'BIT' },
        BYTE: { min: 5001, max: 15000, name: 'BYTE' },
        GIGA: { min: 15001, name: 'GIGA' },
    }
};

export const LoyaltyService = {
    calculateBitsEarned: (amount: number, tier: Tier = 'BIT'): number => {
        // 10 Bits por cada $1.000 (o 1 por cada $100)
        const baseBits = Math.floor(amount / 100);

        // Apply Multiplier
        let multiplier = 1;
        if (tier === 'BYTE') multiplier = 1.2;
        if (tier === 'GIGA') multiplier = 1.5;

        return Math.floor(baseBits * multiplier);
    },

    calculateTier: (totalBits: number): Tier => {
        if (totalBits > LOYALTY_RULES.TIERS.BYTE.max) return 'GIGA';
        if (totalBits > LOYALTY_RULES.TIERS.BIT.max) return 'BYTE';
        return 'BIT';
    },

    getTierBenefits: (tier: Tier): string[] => {
        switch (tier) {
            case 'BIT':
                return ['Cupón 5% bienvenida', 'Acumulación de Bits'];
            case 'BYTE':
                return ['Ofertas Exclusivas', 'Cupón 10% cumpleaños', 'Acumulación x1.2'];
            case 'GIGA':
                return ['Envío Gratis', 'Soporte Prioritario', 'Ofertas relámpago', 'Acumulación x1.5'];
            default:
                return [];
        }
    },

    validateRedemption: (userBits: number, cartTotal: number, bitsToRedeem: number): boolean => {
        if (bitsToRedeem > userBits) return false;
        const maxRedeemable = cartTotal * LOYALTY_RULES.MAX_REDEMPTION_PERCENTAGE;
        return bitsToRedeem <= maxRedeemable;
    },

    calculateMaxRedemption: (userBits: number, cartTotal: number): number => {
        const maxByPolicy = cartTotal * LOYALTY_RULES.MAX_REDEMPTION_PERCENTAGE;
        return Math.min(userBits, maxByPolicy);
    }
};
