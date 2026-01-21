import { useState } from 'react';
import { MapPin, Phone, Mail, Lock, Search, User, ShoppingBag } from 'lucide-react'; // Using Lucide icons as replacements for FontAwesome
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const ContactPage = () => {
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would implement the logic to send the message
        alert('Mensaje enviado (Simulación)');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-white">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight sm:text-5xl">¡Contáctanos!</h1>
                    <p className="mt-4 text-lg text-gray-500">Estamos aquí para ayudarte con cualquier duda sobre tecnología.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Contact Info Side */}
                    <div className="lg:w-1/2 p-8 bg-[#1f69a2] text-white">
                        <h3 className="text-2xl font-bold mb-8 border-b border-blue-400 pb-4">Información de Contacto</h3>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-100">Dirección</p>
                                    <p className="text-white">Calle Nueva 1660, Huechuraba, Santiago, Chile</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <Phone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-100">Teléfono</p>
                                    <p className="text-white">+56 9 3677 8106</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-100">Email</p>
                                    <p className="text-white">contacto@mundodigital.cl</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 rounded-lg overflow-hidden shadow-lg border-4 border-white/20">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.805844800215!2d-70.6502226848011!3d-33.43777798077755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a3194a79b1%3A0x23a7b4507022138!2sSantiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1646261234567!5m2!1ses!2scl"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Google Map"
                            ></iframe>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h3>

                            {!isAuthenticated && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Lock className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Debes <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 underline">iniciar sesión</Link> para enviarnos un mensaje.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    disabled={!isAuthenticated}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    disabled={!isAuthenticated}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                    placeholder="tucorreo@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto (Máx 60 palabras)</label>
                                <input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    disabled={!isAuthenticated}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                    placeholder="Consulta sobre producto..."
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje (Máx 300 palabras)</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows={5}
                                    disabled={!isAuthenticated}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors resize-none"
                                    placeholder="Escribe aquí tu consulta..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={!isAuthenticated}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#1f69a2] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider"
                            >
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
