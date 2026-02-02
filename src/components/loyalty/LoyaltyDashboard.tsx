import { Trophy, Zap, Crown } from 'lucide-react';
import type { User } from '../../types';
import { LoyaltyService } from '../../services/loyalty.service';
import { useMemo } from 'react';

interface LoyaltyDashboardProps {
    user: User;
}

export const LoyaltyDashboard = ({ user }: LoyaltyDashboardProps) => {
    const tier = user.tier || 'BIT';
    const bits = user.bits || 0;
    const totalBits = user.totalBitsDetails || 0;

    // Calculate progress to next tier
    const progress = useMemo(() => {
        // LoyaltyService.currentTierCheck(totalBits); 
        let nextTierGoal = 5000;
        let prevTierGoal = 0;

        if (tier === 'BIT') {
            nextTierGoal = 5000;
            prevTierGoal = 0;
        } else if (tier === 'BYTE') {
            nextTierGoal = 15000;
            prevTierGoal = 5001;
        } else {
            // GIGA
            return 100;
        }

        const progressInTier = totalBits - prevTierGoal;
        const totalInTier = nextTierGoal - prevTierGoal;
        return Math.min(100, Math.max(0, (progressInTier / totalInTier) * 100));
    }, [tier, totalBits]);

    const getTierColor = (t: string) => {
        switch (t) {
            case 'BIT': return 'from-amber-400 to-orange-600';
            case 'BYTE': return 'from-slate-400 to-blue-600';
            case 'GIGA': return 'from-purple-500 to-pink-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const TierIcon = () => {
        switch (tier) {
            case 'BIT': return <Trophy className="text-white" size={24} />;
            case 'BYTE': return <Zap className="text-white" size={24} />;
            case 'GIGA': return <Crown className="text-white" size={24} />;
            default: return <Trophy className="text-white" size={24} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header / Banner */}
            <div className={`bg-gradient-to-r ${getTierColor(tier)} p-6 text-white relative`}>
                <div className="flex justify-between items-start z-10 relative">
                    <div>
                        <p className="text-white/80 text-sm font-medium mb-1">Tu Nivel Actual</p>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            {tier} <TierIcon />
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-white/80 text-sm font-medium mb-1">Tus Bits</p>
                        <h2 className="text-3xl font-bold">{bits.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
            </div>

            {/* Progress Section */}
            <div className="p-6">
                <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                    <span>Progreso al siguiente nivel</span>
                    <span className="font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getTierColor(tier)} transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                    {tier === 'GIGA'
                        ? '¡Eres una leyenda! Mantén tu estatus.'
                        : `Te faltan ${Math.max(0, (tier === 'BIT' ? 5000 : 15000) - totalBits)} bits para subir.`
                    }
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Tus Beneficios Activos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {LoyaltyService.getTierBenefits(tier).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${getTierColor(tier)}`}></span>
                                {benefit}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
