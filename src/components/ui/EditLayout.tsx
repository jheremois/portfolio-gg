import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, FileText, Briefcase, PlusCircle, ArrowLeft, Menu, X } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import Image from 'next/image'

export default function EditLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState(pathname)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { user, isLoading, error } = useUser()

    const tabs = [
        { name: 'Profile', path: '/profile/edit', icon: User },
        { name: 'Details', path: '/profile/edit-details', icon: FileText },
        { name: 'Projects', path: '/profile/edit-portfolio-item/list', icon: Briefcase },
    ]

    const handleTabClick = (path: string) => {
        setActiveTab(path)
        router.push(path)
        setIsSidebarOpen(false)
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

    return (
        <div className="flex min-h-screen">
            {/* Mobile menu button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-background border-2 border-white/10 rounded-md shadow-md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="h-8 w-8 text-white" /> : <Menu className="h-8 w-8 text-white" />}
            </button>

            {/* Side Navigation */}
            <nav className={`
                fixed md:static inset-y-0 left-0 z-40 w-80 bg-black p-6 text-text shadow-md transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 border-r-2 border-white/20
            `}>
                <div className="mb-8 mt-12">
                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="h-16 w-16 bg-gray-300 rounded-lg mb-2"></div>
                            <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                        </div>
                    ) : error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : user ? (
                        <div className="">
                            <div className="flex flex-col gap-2">
                                <img
                                    src={user.profile_image || '/placeholder-user.jpg'}
                                    alt={user.name}
                                    width={55}
                                    height={55}
                                    className="rounded-lg h-full"
                                />
                                <div className="">
                                    <h2 className="text-lg font-bold text-gray-200">{user.name}</h2>
                                    {user.email && (
                                        <p className="text-gray-400 text-xs mt-1">{user.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-300">User not found</p>
                    )}
                </div>
                <ul className="space-y-2">
                    {tabs.map((tab) => (
                        <li key={tab.path}>
                            <Link href={tab.path}>
                                <span
                                    className={`flex items-center py-5 px-4 rounded-2xl text-xl font-semibold transition duration-200 ${activeTab === tab.path
                                            ? 'bg-gray-100/15 text-white'
                                            : 'text-text hover:bg-gray-300/20'
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

            {/* Main Content Area */}
            <main className="flex-1 px-4 md:px-8 pt-20 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    )
}