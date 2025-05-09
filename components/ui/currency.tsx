"use client";
import { useState, useEffect } from 'react';
import { SiEthereum } from 'react-icons/si'; // Icon ETH từ react-icons

const formatETH = (value: number | string) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return "0";

    if (numericValue < 0.0001 && numericValue > 0) {
        return numericValue.toExponential(4);
    }
    return parseFloat(numericValue.toFixed(4));
};

interface CurrencyProps {
    value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({ value = 0 }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="font-semibold flex items-center gap-1">
            <SiEthereum className="text-purple-500" /> {/* Icon ETH với màu tím đặc trưng */}
            <span className='font-semibold'>{formatETH(value)}</span>
            <span className="text-gray-500">ETH</span> {/* Đơn vị ETH */}
        </div>
    );
};

export default Currency;