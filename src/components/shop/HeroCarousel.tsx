import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import banner images
import bannerGaming from '../../assets/banner_gaming.png';
import bannerPhones from '../../assets/banner_phones.png';
import bannerLaptops from '../../assets/banner_laptops.png';
import bannerCameras from '../../assets/banner_cameras.png';

interface BannerSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    link: string;
    category?: string;
}

const BANNERS: BannerSlide[] = [
    {
        id: 1,
        image: bannerGaming,
        title: "Setup Gamer Definitivo",
        subtitle: "Potencia tu juego con lo último en hardware",
        link: "/products?category=Componentes",
    },
    {
        id: 2,
        image: bannerPhones,
        title: "Innovación en tus Manos",
        subtitle: "Descubre los smartphones más avanzados del mercado",
        link: "/products?category=Celulares",
    },
    {
        id: 3,
        image: bannerLaptops,
        title: "Productividad sin Límites",
        subtitle: "Laptops ultraligeras y potentes para profesionales",
        link: "/products?category=Laptops",
    },
    {
        id: 4,
        image: bannerCameras,
        title: "Captura el Momento",
        subtitle: "Cámaras y drones para aventuras inolvidables",
        link: "/products?category=Cámaras",
    },
];

export const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
    };

    // Auto-play
    useEffect(() => {
        const interval = setInterval(nextSlide, 6000); // 6 seconds per slide
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <section className="relative w-full aspect-video md:h-[500px] overflow-hidden group">
            {/* Slides Loop */}
            {BANNERS.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <img
                        className="w-full h-full object-cover"
                        src={banner.image}
                        alt={banner.title}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center px-4 max-w-4xl mx-auto transform transition-transform duration-700 translate-y-0">
                            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-2 sm:mb-6 drop-shadow-lg tracking-tight">
                                {banner.title}
                            </h1>
                            <p className="text-sm sm:text-xl md:text-2xl text-gray-100 mb-4 sm:mb-8 font-light drop-shadow-md line-clamp-2">
                                {banner.subtitle}
                            </p>
                            <Link
                                to={banner.link}
                                className="inline-block bg-blue-600 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 text-sm sm:text-base rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
                            >
                                Ver Productos
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                {BANNERS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};
