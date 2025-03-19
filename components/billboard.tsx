"use client";

import { Billboard as BillboardType } from '@/types';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BillboardProps {
    data: BillboardType[];
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [isHovered, data.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };

    return (
        <div 
            className="relative w-full h-[500px] mt-6 px-5 py-3 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Billboard Container */}
            <div className="relative w-full h-[500px] rounded-xl aspect-[5/5] overflow-hidden z-10">
                <div
                    className="flex transition-transform duration-700"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {data.map((billboard, index) => (
                        <div
                            key={billboard.id}
                            className={`min-w-full h-full flex items-center justify-center bg-cover bg-center transition-transform duration-700 ${
                            index === currentIndex && isHovered ? "scale-105" : "scale-100"
                            }`}
                            style={{ backgroundImage: `url(${billboard.imageUrl})` }}
                        >
                            <div 
                            className={`flex flex-col w-full gap-y-8 p-8 rounded-xl h-[470px] transition-all duration-700 ${
                                isHovered
                                ? "items-end justify-end bg-transparent"
                                : "items-end justify-end bg-black/30"
                            }`}
                            >
                            <div className="max-w-xs mr-10 text-3xl font-bold text-white sm:text-5xl lg:text-6xl sm:max-w-xl transition-all duration-700 bg-slate-500/40 p-4 rounded-xl">
                                {billboard.label}
                            </div>
                            </div>
                        </div>
                        ))}
                </div>
            </div>
            {/* Left Arrow */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-white/60 hover:text-black hover:scale-150 transition z-20"
            >
                <ChevronLeft size={32} />
            </button>

            {/* Right Arrow */}
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-white/60 hover:text-black hover:scale-150 transition z-20"
            >
                <ChevronRight size={32} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {data.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                            index === currentIndex ? "bg-white scale-125" : "bg-gray-500"
                        }`}
                    />
                ))}
            </div>

            {/* Background effect */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center blur-md transition-all duration-700 z-0"
                style={{ backgroundImage: `url(${data[currentIndex]?.imageUrl})` }}
            />
        </div>
    );
};

export default Billboard;
