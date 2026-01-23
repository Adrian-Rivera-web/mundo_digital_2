import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ReviewService } from '../../services/review.service';
import type { Review } from '../../types';
import { StarRating } from '../ui/StarRating';
import { User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductReviewsProps {
    productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({ average: 0, count: 0 });
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = () => {
        const productReviews = ReviewService.getReviewsByProduct(productId);
        setReviews(productReviews);
        setStats(ReviewService.getAverageRating(productId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            ReviewService.addReview({
                productId,
                userId: user.id,
                userName: user.name,
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: '' });
            loadReviews(); // Refresh list
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Reseñas de Clientes
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">({reviews.length})</span>
            </h3>

            {/* Stats Summary */}
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.average || '0.0'}</div>
                    <StarRating rating={Math.round(stats.average)} size={24} className="justify-center my-1" />
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stats.count} Opiniones</div>
                </div>
                <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 mx-4 hidden sm:block"></div>
                <p className="hidden sm:block text-gray-600 dark:text-gray-300 text-sm max-w-md">
                    Las opiniones son verificadas de usuarios registrados para garantizar la autenticidad de la experiencia de compra.
                </p>
            </div>

            {/* Review Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Escribe tu opinión</h4>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tu Calificación</label>
                        <StarRating
                            rating={newReview.rating}
                            interactive
                            onRatingChange={(r) => setNewReview({ ...newReview, rating: r })}
                            size={28}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tu Comentario</label>
                        <textarea
                            required
                            rows={3}
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Cuéntanos qué te pareció el producto..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
                    </button>
                </form>
            ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center border border-blue-100 dark:border-blue-900/30">
                    <p className="text-blue-800 dark:text-blue-300 font-medium mb-3">¿Ya compraste este producto?</p>
                    <Link to="/login" className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Inicia sesión para opinar
                    </Link>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-10">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
                    </div>
                ) : (
                    reviews.slice(0, visibleCount).map((review) => (
                        <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{review.userName}</p>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                                            <span>{new Date(review.date).toLocaleDateString()}</span>
                                            {/* Optional: Add "Verified Purchase" badge here later */}
                                        </div>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} size={16} />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 pl-12 sm:pl-14">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}

                {reviews.length > visibleCount && (
                    <div className="text-center pt-4">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 5)}
                            className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Ver más opiniones
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
