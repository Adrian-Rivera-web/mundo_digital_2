import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../types';
import { BlogService } from '../../services/blog.service';
import { Calendar, User as UserIcon } from 'lucide-react';

export const BlogListPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await BlogService.getAll();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Blog Mundo Digital
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Noticias, guías y reviews sobre lo último en tecnología.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300 bg-white dark:bg-gray-800">
                        <div className="flex-shrink-0">
                            <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <Link to={`/blog/${post.id}`} className="block mt-2">
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </p>
                                    <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="sr-only">{post.author}</span>
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {post.author}
                                    </p>
                                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <time dateTime={post.date}>{post.date}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
