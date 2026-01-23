import type { Review } from '../types';

const REVIEWS_KEY = 'mundo_digital_reviews';

export const ReviewService = {
    getAll: (): Review[] => {
        const reviewsStr = localStorage.getItem(REVIEWS_KEY);
        return reviewsStr ? JSON.parse(reviewsStr) : [];
    },

    getReviewsByProduct: (productId: string): Review[] => {
        const reviews = ReviewService.getAll();
        return reviews.filter(r => r.productId === productId).sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    },

    addReview: (review: Omit<Review, 'id' | 'date'>): Review => {
        const reviews = ReviewService.getAll();
        const newReview: Review = {
            ...review,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString()
        };

        reviews.push(newReview);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
        return newReview;
    },

    getAverageRating: (productId: string): { average: number; count: number } => {
        const reviews = ReviewService.getReviewsByProduct(productId);
        if (reviews.length === 0) return { average: 0, count: 0 };

        const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        return {
            average: Number((sum / reviews.length).toFixed(1)),
            count: reviews.length
        };
    }
};
