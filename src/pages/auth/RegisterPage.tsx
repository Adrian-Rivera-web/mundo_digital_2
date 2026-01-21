import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Trophy, Zap, Crown } from 'lucide-react';
import { useState } from 'react';

// RUT Validation Helpers
const cleanRut = (rut: string) => typeof rut === 'string' ? rut.replace(/[^0-9kK]+/g, '').toUpperCase() : '';

const validateRut = (rut: string): boolean => {
    const clean = cleanRut(rut);
    if (!clean || clean.length < 8) return false;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDv = 11 - (sum % 11);
    const expectedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

    return dv === expectedDv;
};

const formatRut = (rut: string) => {
    let clean = cleanRut(rut);
    if (clean.length <= 1) return clean;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);

    let formattedBody = '';
    for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
        formattedBody = body[i] + (j > 0 && j % 3 === 0 ? '.' : '') + formattedBody;
    }

    return `${formattedBody}-${dv}`;
};

const registerSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    rut: z.string().refine(validateRut, {
        message: 'RUT inválido (Revisa el dígito verificador)',
    }),
    phone: z.string().min(8, 'Teléfono inválido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 8 caracteres (1 mayúscula, 1 minúscula, 1 número)'),
    confirmPassword: z.string(),
    acceptProgram: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar los términos del programa',
    }),
    acceptTerms: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar los términos y condiciones',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormData) => {
        // Concatenate first and last name for backend compatibility
        const fullName = `${data.firstName} ${data.lastName}`;
        await registerUser(fullName, data.email, data.rut, `+56 ${data.phone}`, data.password);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Form */}
                <div>
                    <h2 className="text-2xl font-normal text-gray-900 dark:text-gray-100 mb-6">
                        Inicia sesión o regístrate para comprar
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
                            <input
                                placeholder="Ingresa un nombre"
                                {...register('firstName')}
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Apellidos</label>
                            <input
                                placeholder="Ingresa apellidos"
                                {...register('lastName')}
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Tipo de documento</label>
                            <div className="flex">
                                <select className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-l px-3 py-2 bg-gray-50 focus:outline-none w-24">
                                    <option>RUT</option>
                                </select>
                                <input
                                    placeholder="Ingresa un documento de identidad"
                                    {...register('rut', {
                                        onChange: (e) => {
                                            e.target.value = formatRut(e.target.value);
                                        }
                                    })}
                                    className="flex-1 border-y border-r border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-r px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Ej: 12.345.678-9</p>
                            {errors.rut && <p className="text-xs text-red-500 mt-1">{errors.rut.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Celular</label>
                            <div className="flex relative">
                                <span className="absolute left-3 top-2 text-gray-500">+56</span>
                                <input
                                    placeholder="Ingresa un celular"
                                    {...register('phone')}
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 pl-12 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Comienza con 9.</p>
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Correo</label>
                            <input
                                placeholder="Ingresa un correo"
                                {...register('email')}
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ingresa una contraseña"
                                    {...register('password')}
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                                <span>• Mín. 8 caracteres</span>
                                <span>• 1 número</span>
                                <span>• 1 minúscula</span>
                                <span>• Sin espacio</span>
                                <span>• 1 mayúscula</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmar Contraseña</label>
                            <input
                                type="password"
                                placeholder="Confirma tu contraseña"
                                {...register('confirmPassword')}
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="space-y-3 mt-4">
                            <label className="flex items-start gap-2">
                                <input type="checkbox" className="mt-1" {...register('acceptProgram')} />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Acepto ser parte del <a href="#" className="underline">programa Mundo Bits</a> y con ello recibir novedades y ofertas personalizadas de Mundo Digital, donde podré darme de baja cuando quiera según la <a href="#" className="underline">política de privacidad</a>.
                                </span>
                            </label>
                            {errors.acceptProgram && <p className="text-xs text-red-500">{errors.acceptProgram.message}</p>}

                            <label className="flex items-start gap-2">
                                <input type="checkbox" className="mt-1" {...register('acceptTerms')} />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Acepto los <a href="#" className="underline">términos y condiciones</a> de Mi cuenta.
                                </span>
                            </label>
                            {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full mt-6 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Registrando...' : 'Regístrate'}
                        </button>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm underline text-gray-600 dark:text-gray-400">¿Ya tienes cuenta? Inicia sesión</Link>
                        </div>

                    </form>
                </div>

                {/* Right Column: Benefits */}
                <div className="hidden lg:block pl-12 border-l border-gray-200 dark:border-gray-700">
                    <div className="mb-10">
                        <h3 className="text-xl text-gray-800 dark:text-gray-100 font-medium mb-2">Sube de nivel con Mundo Bits</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Únete al programa de fidelización gamer más grande de Chile.
                            Acumula Bits con cada compra y desbloquea beneficios legendarios.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Tier BIT */}
                        <div className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border border-amber-100 dark:border-gray-700">
                            <div className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 p-3 text-white shadow-sm">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    Nivel BIT
                                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium border border-amber-200">Start</span>
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                        Cupón 5% bienvenida
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                        Acumula 1 Bit por cada $100
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Tier BYTE */}
                        <div className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border border-slate-100 dark:border-gray-700 opacity-90">
                            <div className="rounded-lg bg-gradient-to-br from-slate-400 to-blue-600 p-3 text-white shadow-sm">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    Nivel BYTE
                                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium border border-slate-200">Pro</span>
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        Acceso a Ofertas Flash VIP
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        Multiplicador x1.2 Bits
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Tier GIGA */}
                        <div className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border border-purple-100 dark:border-gray-700 opacity-90">
                            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-3 text-white shadow-sm">
                                <Crown size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    Nivel GIGA
                                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium border border-purple-200">Legend</span>
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                        <span className="font-medium text-purple-600 dark:text-purple-400">Envío Gratis Todo Chile</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                        Soporte Prioritario 24/7
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
