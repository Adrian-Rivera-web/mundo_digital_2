import type { BlogPost } from '../types';
import api from '../api/axios';

export const BlogService = {
    getAll: async (): Promise<BlogPost[]> => {
        try {
            const response = await api.get('/blog/posts');
            // Map MongoDB _id to frontend id
            return response.data.map((post: any) => ({
                ...post,
                id: post._id || post.id
            }));
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    },

    getById: async (id: string): Promise<BlogPost | undefined> => {
        try {
            const posts = await BlogService.getAll();
            return posts.find((p: BlogPost) => p.id === id);
        } catch (error) {
            return undefined;
        }
    }
};
