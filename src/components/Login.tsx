import { motion } from 'framer-motion';
import Head from 'next/head';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
                toast.error('Failed to sign in with Google. Please try again.');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-title">
                <ArrowPathIcon className="w-8 h-8 animate-spin" />
                <span className="ml-2 text-lg">Loading your session...</span>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Sign in to Portfolio GG - Geek Guys Studio</title>
                <meta name="description" content="Access your Portfolio GG account. Create and showcase your professional portfolio with ease." />
            </Head>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            <main className="bg-background text-title min-h-screen">
                <section className="flex flex-col md:flex-row h-screen">
                    {/* Left side - Decorative area */}
                    <div className="hidden md:flex md:w-2/5 bg-[#121212] relative overflow-hidden">
                        <div 
                            className="absolute inset-0 z-0 animate-[diagonalScroll_25s_linear_infinite]"
                            style={{
                                mixBlendMode: 'soft-light',
                                background: 'url("/gg-studio-logo.svg") repeat',
                                backgroundSize: '120px 77px',
                                backgroundPosition: '0 0',
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] z-10" />
                        <div className="absolute bottom-10 left-10 z-20 text-white">
                            <h2 className="text-2xl font-bold mb-2">Portfolio GG</h2>
                            <p className="text-sm opacity-75">Showcase your skills. Build your future.</p>
                        </div>
                    </div>

                    {/* Right side - Login form */}
                    <div className="flex-1 flex items-center bg-gray-100/5 justify-center px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md w-full space-y-8">
                            <div>
                                <Image 
                                    src="/gg-studio-logo.svg" 
                                    alt="Geek Guys Studio Logo" 
                                    width={80} 
                                    height={80} 
                                    className="mx-auto h-20 w-auto rotate-12"
                                />
                                <h1 className="mt-6 text-center text-3xl font-extrabold">
                                    Welcome to Portfolio GG
                                </h1>
                                <p className="mt-2 text-center text-sm text-gray-300">
                                    Sign in with Google to create and manage your professional portfolio
                                </p>
                            </div>
                            <motion.button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-2xl text-black bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                                {isLoading ? (
                                    <>
                                        <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <Image src="/google.png" alt="Google logo" width={20} height={20} className="mr-2" />
                                        Sign in with Google
                                    </>
                                )}
                            </motion.button>
                            <p className="mt-2 text-center text-xs text-gray-400">
                                By signing in, you agree to our{' '}
                                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                                    Privacy Policy
                                </a>
                            </p>
                            <p className="mt-2 text-center text-base text-gray-400">
                                By <strong className='text-[#725cf7] underline'> <Link target='_blank' href="https://www.geekguysstudio.com/es"> Geek Guys Studio</Link></strong> 
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Login;