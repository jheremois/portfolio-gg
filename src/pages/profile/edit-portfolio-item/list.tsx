import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import EditLayout from '@/components/ui/EditLayout'
import { PenIcon, Trash2Icon } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DialogDescription } from '@radix-ui/react-dialog'

interface ProjectProperties {
    id: string
    imgBg: string
    title: string
    description: string
    bgColor: string
    projectUrl: string
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

const Project = ({ id, imgBg, title, bgColor, onEdit, onDelete }: ProjectProperties) => {
    return (
        <div
            style={{
                backgroundImage: `url(${imgBg})`,
                backgroundColor: bgColor,
            }}
            className="moveTopDel w-full rounded-3xl h-[22rem] relative border-4 border-border bg-no-repeat bg-cover overflow-hidden cursor-pointer transition-transform duration-300"
        >
            <div className="relative flex justify-end p-4">
                <div className="space-y-3">
                    <button
                        onClick={() => onDelete(id)}
                        className="bg-red-600 rounded-full flex items-center justify-center text-white p-3 hover:scale-105 duration-150 w-12 h-12 shadow-lg border-2 border-gray-100/30"
                    >
                        <Trash2Icon width={20} />
                    </button>
                    <button
                        onClick={() => onEdit(id)}
                        className="bg-gray-500 rounded-full flex items-center justify-center text-white p-3 hover:scale-105 duration-150 w-12 h-12 shadow-lg border-2 border-gray-100/30"
                    >
                        <PenIcon width={20} />
                    </button>
                </div>
            </div>
            <div
                className="p-6 bg-neutral-900/85 max-h-24 border-t-2 border-border backdrop-blur-lg bottom-0 absolute w-full transition-all duration-300 hover:max-h-full group"
            >
                <div className="flex items-start gap-2 justify-between">
                    <div>
                        <p className="font-semibold text-lg text-title">{title}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='bg-card text-title border-gray-200/20'>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription className='text-text'>
                        Are you sure you want to delete this portfolio item? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='gap-3'>
                    <button
                        className='
                            bg-secondary border-2 border-gray-300/20 
                            py-2 px-4 rounded-xl text-title font-semibold
                        '
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className='
                            bg-red-600 border-2 border-gray-300/20 
                            py-2 px-4 rounded-xl text-title font-semibold
                        '
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Profile() {
    const { data: session, status }: any = useSession()
    const router = useRouter()
    const [portfolioItems, setPortfolioItems] = useState([])
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [projectsSectionName, setProjectsSectionName] = useState('Projects')
    const [isEditingSectionName, setIsEditingSectionName] = useState(false)
    const [newSectionName, setNewSectionName] = useState('')

    const fetchPortfolioItems = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/getPortfolioItems')
            const data = await response.json()

            if (response.ok) {
                setPortfolioItems(data.portfolioItems)
                setProjectsSectionName(data.projectsSectionName)
            } else {
                toast.error(data.error || 'Failed to fetch portfolio items')
            }
        } catch (error) {
            toast.error('An error occurred while fetching portfolio items.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        } else if (status === 'authenticated' && session?.user) {
            fetchPortfolioItems()
        }
    }, [status, session, router])

    const handleEdit = (id: string) => {
        router.push(`/profile/edit-portfolio-item/${id}`)
    }

    const handleDelete = (id: string) => {
        setItemToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!itemToDelete) return

        try {
            const response = await fetch(`/api/portfolioItems/${itemToDelete}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('Portfolio item deleted successfully')
                fetchPortfolioItems() // Refresh the list
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to delete portfolio item')
            }
        } catch (error) {
            toast.error('An error occurred while deleting the portfolio item')
        }

        setIsDeleteModalOpen(false)
        setItemToDelete(null)
    }

    const handleEditSectionName = () => {
        setNewSectionName(projectsSectionName)
        setIsEditingSectionName(true)
    }

    const handleSaveSectionName = async () => {
        try {
            const response = await fetch('/api/update-section-names', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projects_section_name: newSectionName }),
            })

            if (response.ok) {
                setProjectsSectionName(newSectionName)
                toast.success('Section name updated successfully')
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to update section name')
            }
        } catch (error) {
            toast.error('An error occurred while updating the section name')
        }

        setIsEditingSectionName(false)
    }

    if (status === 'loading' || isLoading) {
        return (
            <EditLayout>
                <div className="flex flex-col items-center justify-center min-h-[40rem] bg-background text-title">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-32 h-32"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t-4 border-blue-500 rounded-full"
                        ></motion.div>
                        <Image
                            src="/gg-studio-logo.svg"
                            alt="Geek Guys Studio Logo"
                            width={80}
                            height={80}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-4 text-lg font-medium text-gray-300"
                    >
                        Loading your profile information...
                    </motion.p>
                </div>
            </EditLayout>
        )
    }

    return (
        <EditLayout>
            <div className="mx-auto max-w-6xl text-text py-8">
                <div className="w-full">
                    <div 
                        className="
                            flex w-full justify-between mb-8 flex-col items-start 
                            lg:items-center lg:gap-2 lg:mb-4 lg:flex-row gap-4
                            divide-y-2 lg:divide-y-0 divide-border
                        "
                    >
                        <div className="flex justify-between items-center mb-4 w-full lg:w-fit">
                            {isEditingSectionName ? (
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="text"
                                        value={newSectionName}
                                        onChange={(e) => setNewSectionName(e.target.value)}
                                        className="bg-input border-2 border-border rounded-lg px-2 py-1 text-text"
                                    />
                                    <button
                                        onClick={handleSaveSectionName}
                                        className="bg-primary text-white px-3 py-1 rounded-lg"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between flex-col w-full items-start lg:items-center gap-2 lg:flex-row">
                                    <h2 className="text-2xl font-semibold">{projectsSectionName}</h2>
                                    <button
                                        onClick={handleEditSectionName}
                                        className="text-blue-500 hover:text-blue-700 flex items-center gap-3"
                                    >
                                        <div className="bg-black border-border border w-8 h-8 p-0 flex justify-center items-center rounded-full">
                                            <PenIcon width={13} />
                                        </div>
                                        Edit Section Name
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className='w-full py-8 lg:w-fit'>
                            <Link href="/profile/edit-new-project">
                                <button className='bg-primary w-full border-2 border-gray-300/20 py-3 px-6 rounded-2xl text-title font-semibold'>
                                    Add project
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="grid gap-6">
                    <div className="projectList grid md:grid-cols-3 gap-7">
                        {portfolioItems.map((item: any) => (
                            <Project
                                key={item.id}
                                id={item.id}
                                imgBg={item.image_url || ''}
                                title={item.portfolio_name}
                                description={item.description || ''}
                                bgColor={item.color || '#000'}
                                projectUrl={item.link || '#'}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </EditLayout>
    )
}