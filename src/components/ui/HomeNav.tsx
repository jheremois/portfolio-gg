import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Eye, Edit2 } from 'lucide-react'
import SEOMetadata from './SeoMetadata'
import { signOut } from 'next-auth/react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface FloatingNavLayoutProps {
    children: React.ReactNode;
    showNav?: boolean;
}

export default function FloatingNavLayout({ children, showNav = true }: FloatingNavLayoutProps) {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

    const navItems = [
        { name: 'Preview', path: '/profile', icon: Eye },
        { name: 'Edit', path: '/profile/edit', icon: Edit2 },
    ]

    const handleNavClick = (path: string) => {
        router.push(path)
        setIsMenuOpen(false)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setIsMenuOpen(true)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const isActive = (path: string) => {
        if (path === '/profile') {
            return router.pathname === '/profile'
        }
        if (path === '/profile/edit') {
            return router.pathname.includes('/edit')
        }
        return false
    }

    const handleLogout = async () => {
        setIsLogoutDialogOpen(false)
        await signOut({ callbackUrl: '/' })
    }

    return (
        <>
            <SEOMetadata
                title="Portfoliogg - Create Your Professional Portfolio"
                description="Portfoliogg is a user-friendly platform for creating and sharing professional portfolios. Showcase your skills, projects, and achievements with ease."
                canonicalUrl="https://www.portfoliogg.com/"
            />
            <div className="flex flex-col h-screen">
                {showNav && (
                    <div 
                        className="
                        flex
                            flex-shrink-0 z-50 bg-sidebar h-20 lg:bg-transparent 
                            lg:w-full lg:border-b-0 lg:border-border/0
                        "
                    >
                        <div className="h-20 flex justify-center items-center gap-4 w-full bg-sidebar border-b-2 border-border">
                            <nav className="z-50 rounded-xl p-2 bg-card border-2 border-white/10 shadow-lg">
                                <div className="flex items-center space-x-1">
                                    {navItems.map((item) => (
                                        <Link key={item.path} href={item.path}>
                                            <span
                                                className={`flex items-center px-8 py-2 rounded-lg transition-all duration-300 ${isActive(item.path)
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-300 hover:bg-background'
                                                    }`}
                                                onClick={() => handleNavClick(item.path)}
                                            >
                                                <item.icon className="h-5 w-5" aria-hidden="true" />
                                                <span className="ml-2 font-medium">{item.name}</span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                            <div className="">
                                <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                                    <DialogTrigger asChild>
                                        <div className="">
                                            <button
                                                className='flex items-center gap-1 bg-red-950 shadow-lg text-white/80 p-3 py-3 rounded-full border-2 border-red-600'
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                                </svg>
                                            </button>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className='bg-card text-title border-gray-200/20'>
                                        <DialogHeader>
                                            <DialogTitle>Are you sure you want to log out?</DialogTitle>
                                            <DialogDescription className='text-text'>
                                                You will be redirected to the home page after logging out.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className='pt-5 gap-4 lg:gap-2'>
                                            <button
                                                className='bg-secondary border-2 border-gray-300/20 py-2 px-4 rounded-xl text-title font-semibold'
                                                onClick={() => setIsLogoutDialogOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className='bg-red-600 border-2 border-gray-300/20 py-2 px-4 rounded-xl text-title font-semibold'
                                                onClick={handleLogout}
                                            >
                                                Log out
                                            </button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                )}
                <main className="flex-grow overflow-y-auto">
                    {children}
                </main>
            </div>
        </>
    )
}