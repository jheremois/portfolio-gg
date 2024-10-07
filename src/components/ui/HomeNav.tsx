import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Eye, Edit2 } from 'lucide-react'
import SEOMetadata from './SeoMetadata';

interface FloatingNavLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function FloatingNavLayout({ children, showNav = true }: FloatingNavLayoutProps) {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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

    return (
        <>
        <SEOMetadata
        title="Portfoliogg - Create Your Professional Portfolio"
        description="Portfoliogg is a user-friendly platform for creating and sharing professional portfolios. Showcase your skills, projects, and achievements with ease."
        canonicalUrl="https://www.portfoliogg.com/"
      />
            <div className="min-h-screen">
                {showNav && (
                    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-sidebar border-2 border-border shadow-lg rounded-full p-2">
                        <div className="flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link key={item.path} href={item.path}>
                                    <span
                                        className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                                            isActive(item.path)
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-600 hover:bg-background'
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
                )}

                <main>
                    {children}
                </main>
            </div>
        </>
    )
}