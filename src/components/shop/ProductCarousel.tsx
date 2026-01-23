import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from '../ui/ProductCard';

interface ProductCarouselProps {
    products: Product[];
}

export const ProductCarousel = ({ products }: ProductCarouselProps) => {
    // We need at least 5 products to make the infinite loop look good with 4 items per slide
    // If fewer, we just show them without carousel logic or duplicate them? 
    // For now, assuming we always get 8 as requested.

    // Clone logic: [Last4, ...RealProducts, First4]
    // This allows smooth transition from last to first and first to last.
    const itemsPerSlide = 4;

    // Safety check
    if (!products || products.length === 0) return null;

    const clonesStart = products.slice(-itemsPerSlide);
    const clonesEnd = products.slice(0, itemsPerSlide);
    const displayProducts = [...clonesStart, ...products, ...clonesEnd];

    // Start at index 'itemsPerSlide' (the first real item)
    const [currentIndex, setCurrentIndex] = useState(itemsPerSlide);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const realCount = products.length;

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
        if (currentIndex >= realCount + itemsPerSlide) {
            setCurrentIndex(itemsPerSlide);
        }
        if (currentIndex < itemsPerSlide) {
            setCurrentIndex(realCount + itemsPerSlide - 1);
        }
    };

    // Auto-play
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, isTransitioning]);

    return (
        <div className="relative w-full group">
            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 ml-2"
            >
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 mr-2"
            >
                <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            <div className="overflow-hidden py-4"> {/* Vertical padding for shadows */}
                <div
                    className="flex"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`,
                        transition: isTransitioning ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {displayProducts.map((product, index) => (
                        <div
                            key={`${product.id}-${index}`}
                            className="flex-shrink-0 w-1/4 px-3" // 1/4 width for 4 items per slide
                        >
                            <div className="h-full">
                                <ProductCard product={product} isPopular={true} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
