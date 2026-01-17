import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    &copy; 2026 Mundo Digital. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};
