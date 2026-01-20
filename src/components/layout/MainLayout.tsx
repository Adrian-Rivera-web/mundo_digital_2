import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
