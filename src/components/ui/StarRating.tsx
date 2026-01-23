import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export const StarRating = ({
    rating,
    maxStars = 5,
    size = 20,
    interactive = false,
    onRatingChange,
    className = ''
}: StarRatingProps) => {
    return (
        <div className={`flex ${className}`}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= rating;

                return (
                    <button
                        key={index}
                        type={interactive ? 'button' : 'button'} // Always button for accessibility, but disabled if not interactive
                        disabled={!interactive}
                        onClick={() => interactive && onRatingChange?.(starValue)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform focus:outline-none`}
                    >
                        <Star
                            size={size}
                            className={`
                                transition-colors
                                ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                            `}
                        />
                    </button>
                );
            })}
        </div>
    );
};
