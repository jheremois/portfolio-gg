import { motion } from 'framer-motion';
import Head from 'next/head';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    // Redirect to profile page if already authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/profile'); // Redirect to profile page
        }
    }, [status, router]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signIn('google', { callbackUrl: '/profile' });
            if (result?.error) {
                toast.error('Failed to sign in with Google.');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Sign in with Google - Geek Guys Studio</title>
            </Head>
            <Toaster />
            <main className={`bg-background text-title`}>
                <section>
                    <div className="gap-0 md:min-h-screen relative flex">
                        <div className="lg:w-2/5 relative w-full hidden md:flex lg:justify-end px-4 bg-[#121212]">
                            <div className="absolute top-0 left-0 w-full h-full shadow-[inset_0_20px_40px_#f0f0f030] z-0 animate-[diagonalScroll_25s_linear_infinite]"
                                style={{
                                    mixBlendMode: 'soft-light',
                                    background: 'url("/gg-studio-logo.svg") repeat',
                                    backgroundSize: '120px 77px',
                                    backgroundPosition: '0 0',
                                }}
                            >
                            </div>
                        </div>
                        <div className="lg:w-1/2 lg:flex justify-start min-h-[85dvh] pt-36 lg:pt-24 2xl:pt-32 px-4 lg:px-8 2xl:px-0 pb-24">
                            <div className="overflow-hidden 2xl:max-w-6xl max-w-2xl w-full flex items-center">
                                <div className="py-8 px-4 mx-auto max-w-3xl">
                                    <div className="mb-6">
                                        <div className="text-4xl font-semibold mb-4">
                                            Welcome to Portfolio GG
                                        </div>
                                        <h1 className="text-gray-300">
                                            Sign in with Google to access our awesome services
                                        </h1>
                                    </div>
                                    <motion.button
                                        onClick={handleLogin}
                                        disabled={isLoading}
                                        className="w-full px-4 py-4 bg-white text-black rounded-xl shadow-md hover:bg-blue-50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                    >
                                        {isLoading ? (
                                            <ArrowPathIcon width={30} className="animate-spin" />
                                        ) : (
                                            <div className="flex gap-2 items-center justify-center">
                                                <Image src="/google.png" alt="Google logo" width={24} height={24} />
                                                Sign in with Google
                                            </div>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Login;
