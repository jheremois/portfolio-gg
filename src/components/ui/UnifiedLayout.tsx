import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, FileText, Briefcase, PlusCircle, ArrowLeft, Menu, X, Eye, Edit2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useUser } from '@/hooks/UserContext'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SEOMetadata from './SeoMetadata'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import FirstTimeWalkthrough from './FirstTimeWalkthrougn'

interface UnifiedLayoutProps {
    children: React.ReactNode;
}

export default function UnifiedLayout({ children }: UnifiedLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState<string | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { userData, loading, error } = useUser()
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
    const [showWalkthrough, setShowWalkthrough] = useState(true)

    const tabs = [
        { name: 'Profile', path: '/profile/edit', icon: User },
        { name: 'Contact', path: '/profile/edit-contact', icon: EnvelopeClosedIcon },
        { name: 'Details', path: '/profile/edit-details', icon: FileText },
        { name: 'Projects', path: '/profile/edit-portfolio-item/list', icon: Briefcase },
    ]

    const navItems = [
        { name: 'Preview', path: '/profile', icon: Eye },
        { name: 'Edit', path: '/profile/edit', icon: Edit2 },
    ]

    useEffect(() => {
        if (pathname) {
            setActiveTab(pathname)
        }
    }, [pathname])

    const handleTabClick = (path: string) => {
        setActiveTab(path)
        router.push(path)
        setIsSidebarOpen(false)
    }

    const handleLogout = async () => {
        setIsLogoutDialogOpen(false)
        await signOut({ callbackUrl: '/' })
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true)
            } else {
                setIsSidebarOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleWalkthroughComplete = () => {
        setShowWalkthrough(false)
        localStorage.setItem('walkthroughCompleted', 'true')
    }

    useEffect(() => {
        const walkthroughCompleted = localStorage.getItem('walkthroughCompleted')
        if (walkthroughCompleted === 'true') {
            setShowWalkthrough(false)
        }
    }, [])

    const isActive = (path: string) => {
        if (!pathname) return false
        if (path === '/profile') {
            return pathname === '/profile'
        }
        if (path === '/profile/edit') {
            return pathname.includes('/edit')
        }
        return false
    }

    const shouldShowNavAndSidebar = pathname ? (pathname === '/profile' || pathname.includes('/edit')) : false

    return (
        <>
            <SEOMetadata
                title="Portfoliogg - Create Your Professional Portfolio"
                description="Portfoliogg is a user-friendly platform for creating and sharing professional portfolios. Showcase your skills, projects, and achievements with ease."
                canonicalUrl="https://www.portfoliogg.com/"
            />
            <div className="flex flex-col min-h-screen max-h-screen">
                {showWalkthrough && <FirstTimeWalkthrough onComplete={handleWalkthroughComplete} />}

                {shouldShowNavAndSidebar && (
                    <div className="flex-shrink-0 z-50 bg-sidebar h-20 lg:bg-transparent lg:w-full lg:border-b-0 lg:border-border/0">
                        <div className="h-20 flex justify-center items-center gap-4 w-full bg-sidebar border-b-2 border-border">
                            <nav className="z-50 rounded-xl p-2 bg-card border-2 border-white/10 shadow-lg">
                                <div className="flex items-center space-x-1">
                                    {navItems.map((item) => (
                                        <Link key={item.path} href={item.path}>
                                            <span
                                                className={`flex items-center px-8 py-2 rounded-lg transition-all duration-300 ${
                                                    isActive(item.path)
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'text-gray-300 hover:bg-background'
                                                }`}
                                                onClick={() => handleTabClick(item.path)}
                                            >
                                                <item.icon className="h-5 w-5" aria-hidden="true" />
                                                <span className="ml-2 font-medium">{item.name}</span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                            <div>
                                <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            className='flex items-center gap-1 bg-red-950 shadow-lg text-white/80 p-3 py-3 rounded-full border-2 border-red-600'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3  3m3-3H2.25" />
                                            </svg>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent  className='bg-card text-title border-gray-200/20'>
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

                <div className="flex flex-1 overflow-hidden">
                    {shouldShowNavAndSidebar && pathname && pathname.includes('/edit') && (
                        <nav className={`
                            hidden md:block w-80 bg-sidebar p-6 text-text shadow-md border-r-2 border-white/20
                        `}>
                            <div className="pt-12">
                                {loading ? (
                                    <div className="animate-pulse">
                                        <div className="h-16 w-16 bg-gray-300 rounded-lg mb-2"></div>
                                        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                                    </div>
                                ) : error ? (
                                    <>
                                        <p className="text-red-500">Error: {error}</p>
                                        <button
                                            onClick={handleLogout}
                                            className='flex items-center gap-1 bg-gray-900/30 p-3 py-2 rounded-xl border-2 border-white/20'
                                        >
                                            Log out
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                            </svg>
                                        </button>
                                    </>
                                ) : userData ? (
                                    <div className="">
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={userData.profile_image || '/placeholder-user.jpg'}
                                                    alt={userData.name}
                                                    width={55}
                                                    height={55}
                                                    className="rounded-lg h-full"
                                                />
                                            </div>
                                            <div className="">
                                                <h2 className="text-lg font-bold text-gray-200">{userData.name}</h2>
                                                {userData.username && (
                                                    <p className="text-gray-400 text-xs mt-1">@{userData.username}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-300">User not found</p>
                                        <button
                                            onClick={handleLogout}
                                            className='flex items-center gap-1 bg-gray-900/30 p-3 py-2 rounded-xl border-2 border-white/20'
                                        >
                                            Log out
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                            <hr className='my-8 border-t-2 border-gray-200/40' />
                            <nav>
                                <ul className="space-y-2">
                                    {tabs.map((tab) => (
                                        <li key={tab.path}>
                                            <Link href={tab.path}>
                                                <span
                                                    className={`flex items-center py-5 px-4 rounded-2xl text-xl font-semibold transition duration-200 ${
                                                        activeTab === tab.path
                                                            ? 'bg-muted text-white'
                                                            : 'text-text hover:bg-muted/80'
                                                    }`}
                                                    onClick={() => handleTabClick(tab.path)}
                                                >
                                                    <tab.icon className="mr-3 h-5 w-5" />
                                                    {tab.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={"/profile/edit-new-project"}>
                                    <button className="mt-6 flex items-center py-5 w-full px-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-800 transition duration-200">
                                        <PlusCircle className="mr-3 h-5 w-5" />
                                        Add new Project
                                    </button>
                                </Link>
                            </nav>
                        </nav>
                    )}

                    {/* Main Content Area */}
                    <main className={`flex-1 px-4 md:px-8 pt-4 ${!showWalkthrough ? 'pb-20' : ''} md:p-20 overflow-y-auto bg-background`}>
                        {children}
                    </main>
                </div>
                
                {shouldShowNavAndSidebar && pathname && pathname.includes('/edit') && (
                    <div className="md:hidden z-50 bg-sidebar bottom-0 w-full text-text shadow-md border-t-2 border-white/20">
                        <nav className="flex justify-around py-2">
                            {tabs.map((tab) => (
                                <Link key={tab.path} href={tab.path}>
                                    <span
                                        className={`flex flex-col items-center py-2 px-3 rounded-md text-sm font-medium transition duration-200  ${
                                            activeTab === tab.path
                                                ?   'bg-muted text-white'
                                                : 'text-text hover:bg-muted/80'
                                        }`}
                                        onClick={() => handleTabClick(tab.path)}
                                    >
                                        <tab.icon className="h-5 w-5 mb-1" />
                                        {tab.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
                
            </div>
        </>
    )
}