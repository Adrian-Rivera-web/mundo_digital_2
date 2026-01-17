import { ShieldCheck, Users, Award } from 'lucide-react';

export const AboutPage = () => {
    return (
        <div className="bg-white">
            {/* Hero Section / Quiénes Somos */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-blue-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Quiénes Somos
                    </h1>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                            En <span className="font-bold text-blue-600">Mundo Digital</span>, creemos que la tecnología es el motor que impulsa el futuro.
                            Fundada con el objetivo de acercar las últimas innovaciones a cada hogar y oficina, nos hemos consolidado como tu aliado confiable en electrónica.
                        </p>
                        <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                            No solo vendemos productos; ofrecemos soluciones. Nuestro equipo trabaja incansablemente para seleccionar un catálogo de calidad,
                            asegurando que cada dispositivo que llega a tus manos cuente con el respaldo y la garantía que mereces. Nuestra prioridad eres tú y tu experiencia digital.
                        </p>
                    </div>
                    <div className="mt-10 lg:mt-0 relative">
                        {/* Placeholder for ../img/nosotros.jpg */}
                        <div className="aspect-w-16 aspect-h-9 rounded-xl shadow-2xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px]">
                            <Users className="h-32 w-32 text-gray-300" />
                            <span className="absolute text-gray-400 font-medium">Imagen Nosotros</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Misión y Visión Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900">Misión y Visión</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Misión */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                            <div className="h-48 bg-blue-100 flex items-center justify-center">
                                {/* Placeholder for ../img/mision.jpg */}
                                <ShieldCheck className="h-20 w-20 text-blue-500" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
                                <p className="text-gray-600">
                                    Facilitar el acceso a la última tecnología, ofreciendo un catálogo inigualable y una experiencia de compra ágil y confiable para empresas y particulares.
                                </p>
                            </div>
                        </div>

                        {/* Visión */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                            <div className="h-48 bg-indigo-100 flex items-center justify-center">
                                {/* Placeholder for ../img/vision.jpg */}
                                <Award className="h-20 w-20 text-indigo-500" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
                                <p className="text-gray-600">
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
                    <h2 className="text-3xl font-extrabold text-gray-900">¿Por qué Elegirnos?</h2>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-blue-600 rounded-lg p-6 text-center text-white shadow-lg">
                        <p className="text-4xl font-extrabold mb-2">+ 20.000</p>
                        <p className="font-medium text-blue-100">Productos en nuestro catálogo</p>
                    </div>
                    <div className="bg-blue-600 rounded-lg p-6 text-center text-white shadow-lg">
                        <p className="text-4xl font-extrabold mb-2">430</p>
                        <p className="font-medium text-blue-100">Marcas líderes en tecnología</p>
                    </div>
                    <div className="bg-blue-600 rounded-lg p-6 text-center text-white shadow-lg">
                        <p className="text-4xl font-extrabold mb-2">4</p>
                        <p className="font-medium text-blue-100">Canales de venta integrados</p>
                    </div>
                    <div className="bg-blue-600 rounded-lg p-6 text-center text-white shadow-lg">
                        <p className="text-4xl font-extrabold mb-2">7.000 m²</p>
                        <p className="font-medium text-blue-100">De bodega propia</p>
                    </div>
                </div>
            </div>

            {/* Marcas Distribuidoras */}
            <div className="bg-white pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Marcas Distribuidoras</h2>
                    <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[150px]">
                        {/* Placeholder for ../img/distribuidores.svg */}
                        <div className="flex flex-wrap justify-center gap-8 text-gray-400 font-bold text-xl">
                            <span>SAMSUNG</span>
                            <span>APPLE</span>
                            <span>HP</span>
                            <span>DELL</span>
                            <span>LENOVO</span>
                            <span>SONY</span>
                            <span>LG</span>
                            {/* In real app, put the img tag here */}
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-400 italic">
                        (Aquí iría la imagen de los logos de marcas: distribuidores.svg)
                    </p>
                </div>
            </div>
        </div>
    );
};
