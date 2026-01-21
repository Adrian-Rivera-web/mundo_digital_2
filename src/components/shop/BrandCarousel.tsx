import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import New Brand Card Images (JPGs)
import asusCard from '../../assets/Asus.jpg';
import kingstonCard from '../../assets/Kingston.jpg';
import lianLiCard from '../../assets/Lian.jpg';
import corsairCard from '../../assets/corsair.jpg';
import gigabyteCard from '../../assets/gigabyte.jpg';
import msiCard from '../../assets/msi.jpg';
import xpgCard from '../../assets/xpg.jpg';
import zotacCard from '../../assets/zotac.jpg';

interface BrandCard {
    id: number;
    name: string;
    image: string;
}

const BRAND_CARDS: BrandCard[] = [
    { id: 1, name: 'Lian Li', image: lianLiCard },
    { id: 2, name: 'Corsair', image: corsairCard },
    { id: 3, name: 'Zotac', image: zotacCard },
    { id: 4, name: 'XPG', image: xpgCard },
    { id: 5, name: 'Kingston', image: kingstonCard },
    { id: 6, name: 'Gigabyte', image: gigabyteCard },
    { id: 7, name: 'MSI', image: msiCard },
    { id: 8, name: 'Asus', image: asusCard },
];

export const BrandCarousel = () => {
    // Clone logic: [Last4, ...Real8, First4]
    const clonesStart = BRAND_CARDS.slice(-4);
    const clonesEnd = BRAND_CARDS.slice(0, 4);
    const displayBrands = [...clonesStart, ...BRAND_CARDS, ...clonesEnd];

    // Start at index 4 (first real item)
    const [currentIndex, setCurrentIndex] = useState(4);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const realCount = BRAND_CARDS.length;

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    };

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        // Seamless reset
        if (currentIndex >= realCount + 4) {
            setCurrentIndex(4);
        }
        if (currentIndex < 4) {
            setCurrentIndex(realCount + 4 - 1);
        }
    };

    // Auto-play
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, isTransitioning]);

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 py-8 group">
            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            <div className="overflow-hidden">
                <div
                    className="flex"
                    style={{
                        transform: `translateX(-${currentIndex * 25}%)`, // 25% for 4 visible items
                        transition: isTransitioning ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none' // Smooth curve
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {displayBrands.map((brand, index) => (
                        <div
                            key={`${brand.id}-${index}`}
                            className="flex-shrink-0 w-1/4 px-2"
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-md group/card cursor-pointer h-64 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* Full Card Image */}
                                <img
                                    src={brand.image}
                                    alt={`${brand.name} Banner`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                />
                                {/* Optional: Hover Overlay effect */}
                                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
