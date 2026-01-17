import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderSuccessPage = () => {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        // Fire confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    const bankInfo = {
        bank: "Banco Digital",
        account: "1234 5678 9012",
        clabe: "012345678901234567",
        name: "Mundo Digital S.A. de C.V."
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">¡Pedido Realizado!</h2>
                <p className="text-lg text-gray-600 mb-8">Tu número de orden es: <span className="font-mono font-bold text-gray-900">#{id}</span></p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">Instrucciones de Pago</h3>
                    <p className="text-sm text-blue-700 mb-4">
                        Por favor realiza una transferencia bancaria por el total de tu compra a la siguiente cuenta.
                        Tu pedido será procesado una vez que confirmemos el pago.
                    </p>

                    <div className="space-y-2 font-mono text-sm bg-white p-4 rounded border border-blue-100">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Banco:</span>
                            <span className="font-bold">{bankInfo.bank}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Beneficiario:</span>
                            <span className="font-bold">{bankInfo.name}</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-1 -mx-1 rounded"
                            onClick={() => navigator.clipboard.writeText(bankInfo.clabe)}>
                            <span className="text-gray-500">CLABE:</span>
                            <span className="font-bold flex items-center">
                                {bankInfo.clabe} <Copy className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100" />
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed pt-2 mt-2">
                            <span className="text-gray-500">Referencia:</span>
                            <span className="font-bold text-blue-600">PEDIDO-{id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link to="/" className="inline-flex items-center px-4 py-2 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                        Volver a la Tienda
                    </Link>
                </div>
            </div>
        </div>
    );
};
