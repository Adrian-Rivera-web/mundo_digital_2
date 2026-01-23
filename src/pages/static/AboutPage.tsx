import distribuidoresImage from '../../assets/distribuidores.svg';
import nosotrosImage from '../../assets/nosotros.jpg';
import misionImage from '../../assets/mision.jpg';
import visionImage from '../../assets/vision.jpg';

export const AboutPage = () => {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section / Quiénes Somos */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Quiénes Somos
                    </h1>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-300 leading-relaxed">
                            En <span className="font-bold text-blue-600 dark:text-blue-400">Mundo Digital</span>, creemos que la tecnología es el motor que impulsa el futuro.
                            Fundada con el objetivo de acercar las últimas innovaciones a cada hogar y oficina, nos hemos consolidado como tu aliado confiable en electrónica.
                        </p>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-300 leading-relaxed">
                            No solo vendemos productos; ofrecemos soluciones. Nuestro equipo trabaja incansablemente para seleccionar un catálogo de calidad,
                            asegurando que cada dispositivo que llega a tus manos cuente con el respaldo y la garantía que mereces. Nuestra prioridad eres tú y tu experiencia digital.
                        </p>
                    </div>
                    <div className="mt-10 lg:mt-0 relative">
                        <div className="aspect-w-16 aspect-h-9 rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                            <img
                                src={nosotrosImage}
                                alt="Equipo Mundo Digital"
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Misión y Visión Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 py-16 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Misión y Visión</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Misión */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 group border border-gray-100 dark:border-gray-700">
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={misionImage}
                                    alt="Nuestra Misión"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/10 transition-colors" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Misión</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Facilitar el acceso a la última tecnología, ofreciendo un catálogo inigualable y una experiencia de compra ágil y confiable para empresas y particulares.
                                </p>
                            </div>
                        </div>

                        {/* Visión */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 group border border-gray-100 dark:border-gray-700">
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={visionImage}
                                    alt="Nuestra Visión"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/10 transition-colors" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Visión</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Ser el referente líder en comercio electrónico de tecnología en la región, reconocidos por nuestra innovación, logística eficiente y excelencia en el servicio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Por qué elegirnos (Stats) */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">¿Por qué Elegirnos?</h2>
                </div>

                <div className="space-y-6">
                    {/* Top Row: 3 Items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center transition-all hover:-translate-y-1 duration-300 border border-transparent dark:border-gray-700">
                            <p className="text-2xl font-extrabold text-[#1e1b4b] dark:text-blue-300 mb-1">Más de 20.000 productos</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">en nuestro catálogo</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center flex flex-col justify-center transition-all hover:-translate-y-1 duration-300 border border-transparent dark:border-gray-700">
                            <p className="text-2xl font-extrabold text-[#1e1b4b] dark:text-blue-300">430 marcas</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center transition-all hover:-translate-y-1 duration-300 border border-transparent dark:border-gray-700">
                            <p className="text-xl font-extrabold text-[#1e1b4b] dark:text-blue-300 mb-1">4 canales de venta:</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">eCommerce, Marketplaces, Corporativo y Gobierno</p>
                        </div>
                    </div>

                    {/* Bottom Row: 2 Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center transition-all hover:-translate-y-1 duration-300 border border-transparent dark:border-gray-700">
                            <p className="text-2xl font-extrabold text-[#1e1b4b] dark:text-blue-300 mb-1">7.000 m² de almacenaje</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">en bodega</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center transition-all hover:-translate-y-1 duration-300 border border-transparent dark:border-gray-700">
                            <p className="text-2xl font-extrabold text-[#1e1b4b] dark:text-blue-300 mb-1">40 alianzas</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">estratégicas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marcas Distribuidoras */}
            <div className="bg-white dark:bg-gray-900 pb-16 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Marcas Distribuidoras</h2>
                    <div className="flex justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 transition-colors duration-300">
                        <img
                            src={distribuidoresImage}
                            alt="Distribuidores y Marcas"
                            className="max-w-full h-auto object-contain max-h-[400px] grayscale hover:grayscale-0 transition-all duration-300 dark:invert-[0.1]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
