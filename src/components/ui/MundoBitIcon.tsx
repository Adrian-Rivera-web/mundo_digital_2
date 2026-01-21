import React from 'react';
import monedaBit from '../../assets/moneda-bit.svg';

interface MundoBitIconProps {
    className?: string;
    size?: number;
}

export const MundoBitIcon: React.FC<MundoBitIconProps> = ({ className = '', size = 24 }) => {
    return (
        <img
            src={monedaBit}
            alt="Mundo Bit"
            width={size}
            height={size}
            className={`object-contain ${className}`}
        />
    );
};
