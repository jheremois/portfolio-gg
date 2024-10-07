import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, FileText, Briefcase, PlusCircle, ArrowLeft, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useUser } from '@/hooks/UserContext'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SEOMetadata from './SeoMetadata'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'

interface Step {
    title: string;
    description: string;
    image?: string;
    video?: string;
}

const FirstTimeWalkthrough = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1)
    const [isVisible, setIsVisible] = useState(true)

    const steps: Step[] = [
        {
            title: "Welcome! Let's customize your profile",
            description: `
          <div class="space-y-4 text-gray-300">
            <p class="mb-4">Get started by updating your profile with key information:</p>
            <ol class="list-decimal pl-6 space-y-4">
              <li><strong>Profile Picture:</strong> Upload a high-quality image that represents you or your brand.</li>
              <li><strong>Username:</strong> Pick a unique and memorable username for your profile URL.</li>
              <li><strong>Full Name:</strong> Use your full name or your business/product name.</li>
              <li><strong>Profession:</strong> Add your job title, product, or business focus.</li>
              <li><strong>Description:</strong> Write a short intro that captures who you are or what your profile is about.</li>
              <li><strong>Social Media Links:</strong> Add links to your relevant profiles and websites.</li>
            </ol>
            <p class="mt-6">Click <strong>Update Profile</strong> when you're ready to save your changes.</p>
          </div>
          `,
            image: "https://storage.googleapis.com/portfoliprofiles/gettoknowgg/welcome-to-edit-profile-portfolio-gg.png"
        },
        {
            title: "Details Section",
            description: `
          <div class="space-y-4 text-gray-300">
            <p class="mb-4">Customize important details about yourself or your brand:</p>
            <ol class="list-decimal pl-6 space-y-4">
              <li><strong>Skills:</strong> Add or remove relevant skills by clicking "Add Skill" or the red "X".</li>
              <li><strong>Experience:</strong> Add, edit, or delete job roles or achievements.</li>
              <li><strong>Education:</strong> Add education or rename this section to "Certifications" or "Interests".</li>
            </ol>
            <p class="mt-6">Once you're done, your profile will better showcase your expertise.</p>
          </div>
          `,
            image: "https://storage.googleapis.com/portfoliprofiles/gettoknowgg/profile%20details%20portfolio%20plus.png"
        },
        {
            title: "Projects Section",
            description: `
          <div class="space-y-4 text-gray-300">
            <p class="mb-4">Manage your portfolio easily with these options:</p>
            <ol class="list-decimal pl-6 space-y-4">
              <li><strong>Add New Project:</strong> Upload an image, title, description, and link for new projects.</li>
              <li><strong>Edit Projects:</strong> Click the pencil icon to update the details of any project.</li>
              <li><strong>Delete Projects:</strong> Remove a project by clicking the red trash icon.</li>
              <li><strong>Rename Section:</strong> Change the "Projects" name to fit what you’re showcasing.</li>
            </ol>
            <p class="mt-6">Keep your portfolio fresh by regularly adding and updating your projects.</p>
          </div>
          `,
            image: "https://storage.googleapis.com/portfoliprofiles/gettoknowgg/edit%20portfolio%20list%20portfolio%20gg.png"
        },
        {
            title: "You're All Set! Share your profile",
            description: `
          <div class="space-y-4 text-gray-300">
            <p class="mb-4"><strong>Congratulations!</strong> Your profile is ready to share with the world.</p>
            <ol class="list-decimal pl-6 space-y-4">
              <li><strong>Preview:</strong> Use the Preview tab to see how your profile looks before sharing.</li>
              <li><strong>Share:</strong> Copy your profile URL and share it with clients or on social media.</li>
              <li><strong>Pro Tips:</strong> Watch this video for tips on making your portfolio look professional and polished.
            </ol>
            <p class="mt-6">Keep updating your profile as you grow and complete new projects.</p>
          </div>
          `,
            video: "https://www.youtube.com/embed/ejTRNkDBmjs"
        },
    ];

    const handleNext = () => {
        if (step < steps.length) {
            setStep(step + 1)
        } else {
            setIsVisible(false)
        }
    }

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    useEffect(() => {
        if (!isVisible) {
            onComplete()
        }
    }, [isVisible, onComplete])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card text-title border-gray-200/20 rounded-2xl shadow-xl w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200/20">
                                <h2 className="text-2xl font-bold">{steps[step - 1].title}</h2>
                            </div>
                            <div className="flex-grow overflow-y-auto h-[60vh] p-6">
                                <div className="prose prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: steps[step - 1].description }} />
                                </div>
                                <div className="mt-6 flex justify-center">
                                    {step < steps.length ? (
                                        <img
                                            src={steps[step - 1].image}
                                            alt={steps[step - 1].title}
                                            className="rounded-lg object-cover border-2 border-white/20 p-1 w-full h-auto"
                                        />
                                    ) : (
                                        <iframe
                                            src={steps[step - 1].video}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="rounded-lg w-full h-[400px]"
                                        ></iframe>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-6 border-t border-gray-200/20">
                                <button
                                    onClick={handlePrevious}
                                    className="flex items-center px-4 py-2 bg-secondary text-title rounded-xl hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={step === 1}
                                >
                                    <ChevronLeft size={20} className="mr-2" />
                                    Previous
                                </button>
                                <div className="text-sm text-gray-400">
                                    Step {step} of {steps.length}
                                </div>
                                <button
                                    onClick={handleNext}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    {step === steps.length ? "Finish" : "Next"}
                                    <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function EditLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState(pathname)
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

    return (
        <>
            <SEOMetadata
                title="Portfoliogg - Create Your Professional Portfolio"
                description="Portfoliogg is a user-friendly platform for creating and sharing professional portfolios. Showcase your skills, projects, and achievements with ease."
                canonicalUrl="https://www.portfoliogg.com/jheremois/"
            />
            <div className="flex flex-col min-h-screen">
                {showWalkthrough && <FirstTimeWalkthrough onComplete={handleWalkthroughComplete} />}

                {/* Mobile Tabs */}
                <div className="md:hidden z-50 bg-sidebar bottom-0 w-full fixed text-text shadow-md border-t-2 border-white/20">
                    <nav className="flex justify-around py-2">
                        {tabs.map((tab) => (
                            <Link key={tab.path} href={tab.path}>
                                <span
                                    className={`flex flex-col items-center py-2 px-3 rounded-md text-sm font-medium transition duration-200 ${
                                        activeTab === tab.path
                                            ? 'bg-muted text-white'
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

                <div className="flex flex-1">
                    {/* Side Navigation (visible on desktop) */}
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

                    {/* Main Content Area */}
                    <main className="flex-1 px-4 md:px-8 pt-4 pb-20 md:p-20 overflow-y-auto bg-background">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}