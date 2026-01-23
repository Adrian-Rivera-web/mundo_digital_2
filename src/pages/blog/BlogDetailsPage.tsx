import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BlogPost } from '../../types';
import { BlogService } from '../../services/blog.service';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

export const BlogDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            if (!id) return;
            try {
                const data = await BlogService.getById(id);
                setPost(data || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Artículo no encontrado</h2>
                <Link to="/blog" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al blog
                </Link>
            </div>
        );
    }

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/blog" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al blog
            </Link>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg mb-8">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="prose prose-lg prose-blue dark:prose-invert mx-auto">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span className="flex items-center">
                        <User className="mr-1.5 h-4 w-4" />
                        {post.author}
                    </span>
                    <span className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        {post.date}
                    </span>
                    <span className="flex items-center">
                        <Clock className="mr-1.5 h-4 w-4" />
                        5 min lectura
                    </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    {post.title}
                </h1>

                <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </article>
    );
};
