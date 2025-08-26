import { Head } from '@inertiajs/react';

type Props = {
    status: number;
    message: string;
};

export default function NotFound({ status, message }: Props) {
    return (
        <>
            <Head title="Not Found" />
            
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-6xl font-bold text-red-600">{status}</h1>
                <p className="mt-4 text-xl">{message}</p>
            </div>
        </>
    );
}
