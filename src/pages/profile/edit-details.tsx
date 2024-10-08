import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import EditLayout from '@/components/ui/EditLayout'
import { Loader2, PenIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Skill {
    id: string
    skill_name: string
}

interface SectionItem {
    id: string
    title: string
    description: string
}

interface UserData {
    skills: Skill[]
    experienceItems: SectionItem[]
    educationItems: SectionItem[]
    experienceSectionName: string
    educationSectionName: string
    skillsSectionName: string
}

interface EditModalState {
    isOpen: boolean
    type: 'experience' | 'education' | null
    item: SectionItem | null
}

interface SectionNameModalState {
    isOpen: boolean
    type: 'experience' | 'education' | 'skills' | null
}

interface FormErrors {
    [key: string]: string
}

const MAX_SKILLS = 8
const MAX_ITEMS = 4

export default function EditProfile() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [newSkill, setNewSkill] = useState('')
    const [newExperienceItem, setNewExperienceItem] = useState<Omit<SectionItem, 'id'>>({
        title: '',
        description: ''
    })
    const [newEducationItem, setNewEducationItem] = useState<Omit<SectionItem, 'id'>>({
        title: '',
        description: ''
    })
    const [editModalState, setEditModalState] = useState<EditModalState>({
        isOpen: false,
        type: null,
        item: null
    })
    const [sectionNameModalState, setSectionNameModalState] = useState<SectionNameModalState>({
        isOpen: false,
        type: null
    })
    const [editedItem, setEditedItem] = useState<SectionItem | null>(null)
    const [newSectionName, setNewSectionName] = useState('')
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(true)
    const [showExperienceForm, setShowExperienceForm] = useState(false)
    const [showEducationForm, setShowEducationForm] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        } else if (status === 'authenticated') {
            fetchUserData()
        }
    }, [status, router])

    const fetchUserData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/getUser')
            const data = await response.json()
            if (response.ok) {
                setUserData({
                    skills: data.skills || [],
                    experienceItems: data.experienceItems || [],
                    educationItems: data.educationItems || [],
                    experienceSectionName: data.experience_section_name || 'Experience',
                    educationSectionName: data.education_section_name || 'Education',
                    skillsSectionName: data.skills_section_name || 'Skills'
                })
            } else {
                toast.error('Failed to load user data')
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
            toast.error('An error occurred while loading user data.')
        } finally {
            setIsLoading(false)
        }
    }

    const validateSkill = (skill: string): boolean => {
        if (skill.trim().length === 0) {
            setFormErrors(prev => ({ ...prev, newSkill: 'Skill cannot be empty' }))
            return false
        }
        if (skill.length > 50) {
            setFormErrors(prev => ({ ...prev, newSkill: 'Skill must be 50 characters or less' }))
            return false
        }
        if (userData && userData.skills.length >= MAX_SKILLS) {
            setFormErrors(prev => ({ ...prev, newSkill: `You can only add up to ${MAX_SKILLS} skills` }))
            return false
        }
        setFormErrors(prev => ({ ...prev, newSkill: '' }))
        return true
    }

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateSkill(newSkill)) return

        try {
            const response = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skill_name: newSkill }),
            })

            const data = await response.json()
            console.log('Add skill response:', data)

            if (response.ok && data && typeof data === 'object' && 'id' in data && 'skill_name' in data) {
                setUserData(prevData => ({
                    ...prevData!,
                    skills: [...prevData!.skills, data as Skill].slice(0, MAX_SKILLS)
                }))
                setNewSkill('')
                toast.success('Skill added successfully')
            } else {
                throw new Error('Invalid skill data received from server')
            }
        } catch (error: any) {
            console.error('Error adding skill:', error)
            toast.error(`An error occurred while adding the skill: ${error.message}`)
        }
    }

    const handleDeleteSkill = async (skillId: string) => {
        try {
            const response = await fetch(`/api/skills/${skillId}`, {
                method: 'DELETE',
            })

            const data = await response.json()
            console.log('Delete skill response:', data)

            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData!,
                    skills: prevData!.skills.filter(skill => skill.id !== skillId)
                }))
                toast.success('Skill deleted successfully')
            } else {
                throw new Error(data.error || 'Failed to delete skill')
            }
        } catch (error: any) {
            console.error('Error deleting skill:', error)
            toast.error(`An error occurred while deleting the skill: ${error.message}`)
        }
    }

    const validateSectionItem = (item: Omit<SectionItem, 'id'>, section: 'experience' | 'education'): boolean => {
        let isValid = true
        const errors: FormErrors = {}

        if (item.title.trim().length === 0) {
            errors.title = 'Title cannot be empty'
            isValid = false
        } else if (item.title.length > 100) {
            errors.title = 'Title must be 100 characters or less'
            isValid = false
        }

        if (item.description.trim().length === 0) {
            errors.description = 'Description cannot be empty'
            isValid = false
        } else if (item.description.length > 500) {
            errors.description = 'Description must be 500 characters or less'
            isValid = false
        }

        const items = section === 'experience' ? userData?.experienceItems : userData?.educationItems
        if (items && items.length >= MAX_ITEMS) {
            errors.maxItems = `You can only add up to ${MAX_ITEMS} ${section} items`
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleAddExperienceItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateSectionItem(newExperienceItem, 'experience')) return

        try {
            const response = await fetch('/api/experience-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExperienceItem),
            })

            const data = await response.json()
            console.log('Add experience item response:', data)

            if (response.ok && data && typeof data === 'object' && 'id' in data && 'title' in data && 'description' in data) {
                setUserData(prevData => ({
                    ...prevData!,
                    experienceItems: [...prevData!.experienceItems, data as SectionItem].slice(0, MAX_ITEMS)
                }))
                setNewExperienceItem({
                    title: '',
                    description: ''
                })
                toast.success('Experience item added successfully')
            } else {
                throw new Error('Invalid experience item data received from server')
            }
        } catch (error: any) {
            console.error('Error adding experience item:', error)
            toast.error(`An error occurred while adding the experience item: ${error.message}`)
        }
    }

    const handleAddEducationItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateSectionItem(newEducationItem, 'education')) return

        try {
            const response = await fetch('/api/education-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEducationItem),
            })

            const data = await response.json()
            console.log('Add education item response:', data)

            if (response.ok && data && typeof data === 'object' && 'id' in data && 'title' in data && 'description' in data) {
                setUserData(prevData => ({
                    ...prevData!,
                    educationItems: [...prevData!.educationItems, data as SectionItem].slice(0, MAX_ITEMS)
                }))
                setNewEducationItem({
                    title: '',
                    description: ''
                })
                toast.success('Education item added successfully')
            } else {
                throw new Error('Invalid education item data received from server')
            }
        } catch (error: any) {
            console.error('Error adding education item:', error)
            toast.error(`An error occurred while adding the education item: ${error.message}`)
        }
    }

    const handleUpdateItem = async (section: 'experience' | 'education', itemId: string, updatedItem: SectionItem) => {
        if (!validateSectionItem(updatedItem, section)) return

        try {
            const response = await fetch(`/api/${section}-items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            })

            const data = await response.json()
            console.log(`Update ${section} item response:`, data)

            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData!,
                    [section === 'experience' ? 'experienceItems' : 'educationItems']: prevData![section === 'experience' ? 'experienceItems' : 'educationItems'].map(item => item.id === itemId ? updatedItem : item)
                }))
                toast.success(`${section} item updated successfully`)
                setEditModalState({ isOpen: false, type: null, item: null })
            } else {
                throw new Error(data.error || `Failed to update ${section} item`)
            }
        } catch (error: any) {
            console.error(`Error updating ${section} item:`, error)
            toast.error(`An error occurred while updating the ${section} item: ${error.message}`)
        }
    }

    const handleDeleteItem = async (section: 'experience' | 'education', itemId: string) => {
        try {
            const response = await fetch(`/api/${section}-items/${itemId}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData!,
                    [section === 'experience' ? 'experienceItems' : 'educationItems']: prevData![section === 'experience' ? 'experienceItems' : 'educationItems'].filter(item => item.id !== itemId)
                }))
                toast.success(`${section} item deleted successfully`)
            } else {
                throw new Error(data.error || `Failed to delete ${section} item`)
            }
        } catch (error: any) {
            console.error(`Error deleting ${section} item:`, error)
            toast.error(`An error occurred while deleting the ${section} item: ${error.message}`)
        }
    }

    const validateSectionName = (name: string): boolean => {
        if (name.trim().length === 0) {
            setFormErrors(prev => ({ ...prev, sectionName: 'Section name cannot be empty' }))
            return false
        }
        if (name.length > 50) {
            setFormErrors(prev => ({ ...prev, sectionName: 'Section name must be 50 characters or less' }))
            return false
        }
        setFormErrors(prev => ({ ...prev, sectionName: '' }))
        return true
    }

    const handleUpdateSectionName = async (section: 'experience' | 'education' | 'skills', newName: string) => {
        if (!validateSectionName(newName)) return

        try {
            const response = await fetch('/api/update-section-names', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [`${section}_section_name`]: newName }),
            })

            const data = await response.json()
            console.log(`Update ${section} section name response:`, data)

            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData!,
                    [section === 'experience' ? 'experienceSectionName' : 
                     section === 'education' ? 'educationSectionName' : 'skillsSectionName']: newName
                }))
                toast.success(`${section} section name updated successfully`)
                setSectionNameModalState({ isOpen: false, type: null })
            } else {
                throw new Error(data.error || `Failed to update ${section} section name`)
            }
        } catch (error: any) {
            console.error(`Error updating ${section} section name:`, error)
            toast.error(`An error occurred while updating the ${section} section name: ${error.message}`)
        }
    }

    const openEditModal = (type: 'experience' | 'education', item: SectionItem) => {
        setEditModalState({ isOpen: true, type, item })
        setEditedItem(item)
    }

    const openSectionNameModal = (type: 'experience' | 'education' | 'skills') => {
        setSectionNameModalState({ isOpen: true, type })
        setNewSectionName(
            type === 'experience' ? userData?.experienceSectionName || '' : 
            type === 'education' ? userData?.educationSectionName || '' :
            userData?.skillsSectionName || ''
        )
    }

    const toggleExperienceForm = () => {
        setShowExperienceForm(!showExperienceForm)
        if (!showExperienceForm) {
            setNewExperienceItem({ title: '', description: '' })
        }
    }

    const toggleEducationForm = () => {
        setShowEducationForm(!showEducationForm)
        if (!showEducationForm) {
            setNewEducationItem({ title: '', description: '' })
        }
    }

    if (status === 'loading' || isLoading) {
        return (
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
        )
    }


    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-text">
            <h1 className="text-3xl font-bold mb-8">Edit Profile Details</h1>
            <section className="my-8 px-1">
                <div className="flex justify-between mb-8 flex-col items-start lg:items-center gap-2 lg:mb-4 lg:flex-row">
                    <h2 className="text-2xl font-semibold mb-4">{userData!.skillsSectionName} ({userData?.skills.length}/{MAX_SKILLS})</h2>
                    <button
                        onClick={() => openSectionNameModal('skills')}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-3"
                    >
                        <div className="bg-black border-border border w-8 h-8 p-0 flex justify-center items-center rounded-full">
                            <PenIcon width={13}/>
                        </div>
                        Edit Section Name
                    </button>
                </div>
                <form onSubmit={handleAddSkill} className="mb-4">
                    <div className="flex gap-2 items-center flex-col lg:flex-row">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => {
                                setNewSkill(e.target.value)
                                validateSkill(e.target.value)
                            }}
                            placeholder="Enter a new skill"
                            className="
                                flex-1 min-w-0 block w-full px-3 py-3 rounded-lg 
                                bg-input border-2 border-border text-text focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                            "
                            disabled={userData!.skills.length >= MAX_SKILLS}
                        />
                        <button
                            type="submit"
                            className="
                                        cursor-pointer mb-2 bg-text border-2 rounded-lg border-white/30 text-gray-950 font-semibold py-3
                                        px-10 mx-auto lg:mx-0 w-full lg:w-fit mt-2
                                    "
                            disabled={userData!.skills.length >= MAX_SKILLS}
                        >
                            Add Skill
                        </button>
                    </div>
                    {formErrors.newSkill && <p className="text-red-500 mt-1">{formErrors.newSkill}</p>}
                </form>
                <div className="flex flex-wrap gap-3 border-2 rounded-xl p-4 border-gray-50/15">
                    {userData?.skills.map((skill) => (
                        <div key={skill.id} className="bg-muted ring-2 ring-border px-3 py-1 rounded-full flex items-center">
                            <span>{skill.skill_name}</span>
                            <button
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="
                                    ml-2 text-black bg-red-500 w-4 h-4 cale-105 flex items-center justify-center 
                                    rounded-full hover:bg-red-500 hover:scale-110 duration-100
                                "
                                aria-label={`Delete ${skill.skill_name} skill`}
                            >
                                <XIcon />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            <hr className='border-t-[3px] border-gray-100/10' />
            <section className="my-8 px-1">
                <div className="flex justify-between mb-8 flex-col items-start lg:items-center gap-2 lg:mb-4 lg:flex-row">
                    <h2 className="text-2xl font-semibold">{userData!.experienceSectionName} ({userData!.experienceItems.length}/{MAX_ITEMS})</h2>
                    <button
                        onClick={() => openSectionNameModal('experience')}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-3"
                    >
                        <div className="bg-black border-border border w-8 h-8 p-0 flex justify-center items-center rounded-full">
                            <PenIcon width={13}/>
                        </div>
                        Edit Section Name
                    </button>
                </div>
                <div className="flex flex-col space-y-4">
                    {userData!.experienceItems.map((item) => (
                        <div key={item.id} className="p-4 py-6 flex items-start justify-between ring-gray-100/20 bg-card ring-2 rounded-2xl">
                            <div className="">
                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="mb-2">{item.description}</p>
                            </div>
                            <div className="space-x-3 flex">
                                <button
                                    onClick={() => handleDeleteItem('experience', item.id)}
                                    className="bg-red-600 rounded-full flex items-center justify-center text-white p-3 hover:scale-105 duration-150 w-12 h-12 shadow-lg border-2 border-gray-100/30"
                                >
                                    <Trash2Icon width={20} />
                                </button>
                                <button
                                    onClick={() => openEditModal('experience', item)}
                                    className="bg-secondary rounded-full flex items-center justify-center text-white p-3 hover:scale-105 duration-150 w-12 h-12 shadow-lg border-2 border-gray-100/30"
                                >
                                    <PenIcon width={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {userData!.experienceItems.length < MAX_ITEMS && (
                    <div className="">
                        {!showExperienceForm && (
                            <button
                                onClick={toggleExperienceForm}
                                className="cursor-pointer mb-2 gap-2 bg-sidebar border-2 rounded-lg border-gray-300/20 text-text py-3 px-10 mx-auto lg:mx-0 w-full mt-4 flex justify-center"
                            >
                                Add new {" "}
                                <PlusIcon />
                            </button>
                        )}
                        {showExperienceForm && (
                            <form onSubmit={handleAddExperienceItem} className="mb-4 mt-4 p-4 py-6 border-2 border-border bg-card rounded-xl">
                                <input
                                    type="text"
                                    value={newExperienceItem.title}
                                    onChange={(e) => {
                                        setNewExperienceItem({ ...newExperienceItem, title: e.target.value })
                                        validateSectionItem({ ...newExperienceItem, title: e.target.value }, 'experience')
                                    }}
                                    placeholder="Title"
                                    className="flex-1 min-w-0 mb-3 block w-full px-3 py-3 rounded-lg bg-input border-2 border-border text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {formErrors.title && <p className="text-red-500 mb-2">{formErrors.title}</p>}
                                <textarea
                                    value={newExperienceItem.description}
                                    onChange={(e) => {
                                        setNewExperienceItem({ ...newExperienceItem, description: e.target.value })
                                        validateSectionItem({ ...newExperienceItem, description: e.target.value }, 'experience')
                                    }}
                                    placeholder="Description"
                                    className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-border text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows={3}
                                />
                                {formErrors.description && <p className="text-red-500 mb-2">{formErrors.description}</p>}
                                <div className="flex justify-between mt-3">
                                    <button
                                        type="button"
                                        onClick={toggleExperienceForm}
                                        className="text-white px-4 py-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-text border-2 border-white/30 text-gray-950 font-semibold rounded-lg px-4 py-3"
                                    >
                                        Add Item
                                    </button>
                                </div>
                                {formErrors.maxItems && <p className="text-red-500 mt-2">{formErrors.maxItems}</p>}
                            </form>
                        )}
                    </div>
                )}
            </section>

            <hr className='border-t-[3px] border-gray-100/10' />
            <section className="my-8 px-1">
                <div className="flex justify-between mb-8 flex-col items-start lg:items-center gap-2 lg:mb-4 lg:flex-row">
                    <h2 className="text-2xl font-semibold">{userData!.educationSectionName} ({userData!.educationItems.length}/{MAX_ITEMS})</h2>
                    <button
                        onClick={() => openSectionNameModal('education')}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-3"
                    >
                        <div className="bg-black border-border border w-8 h-8 p-0 flex justify-center items-center rounded-full">
                            <PenIcon width={13}/>
                        </div>
                        Edit Section Name
                    </button>
                </div>
                <div className="flex flex-col space-y-4">
                    {userData!.educationItems.map((item) => (
                        <div key={item.id} className="p-4 py-6 flex items-start justify-between ring-gray-100/20 bg-card ring-2 rounded-2xl">
                        <div className="">
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="mb-2">{item.description}</p>
                        </div>
                        <div className="space-x-3 flex">
                            <button
                                onClick={() => handleDeleteItem('education', item.id)}
                                className="bg-red-600 rounded-full flex items-center justify-center text-white p-3 hover:scale-105 duration-150 w-12 h-12 shadow-lg border-2 border-gray-100/30"
                            >
                                <Trash2Icon width={20} />
                            </button>
                            <button
                                onClick={() => openEditModal('education', item)}
                                className="bg-secondary rounded-full flex items-center justify-center text-white p-3 hover:scale-105 duration-150 w-12 h-12 shadow-lg border-2 border-gray-100/30"
                            >
                                <PenIcon width={20} />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
                {userData!.educationItems.length < MAX_ITEMS && (
                    <div className="">
                        {!showEducationForm && (
                            <button
                                onClick={toggleEducationForm}
                                className="cursor-pointer mb-2 gap-2 bg-sidebar border-2 rounded-lg border-gray-300/20 text-text py-3 px-10 mx-auto lg:mx-0 w-full mt-4 flex justify-center"
                            >
                                Add new {" "}
                                <PlusIcon />
                            </button>
                        )}
                        {showEducationForm && (
                            <form onSubmit={handleAddEducationItem} className="mb-4 mt-4 p-4 py-6 border-2 border-border bg-card rounded-xl">
                                <input
                                    type="text"
                                    value={newEducationItem.title}
                                    onChange={(e) => {
                                        setNewEducationItem({ ...newEducationItem, title: e.target.value })
                                        validateSectionItem({ ...newEducationItem, title: e.target.value }, 'education')
                                    }}
                                    placeholder="Title"
                                    className="flex-1 min-w-0 mb-3 block w-full px-3 py-3 rounded-lg bg-input border-2 border-border text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {formErrors.title && <p className="text-red-500 mb-2">{formErrors.title}</p>}
                                <textarea
                                    value={newEducationItem.description}
                                    onChange={(e) => {
                                        setNewEducationItem({ ...newEducationItem, description: e.target.value })
                                        validateSectionItem({ ...newEducationItem, description: e.target.value }, 'education')
                                    }}
                                    placeholder="Description"
                                    className="flex-1 min-w-0 mb-3 block w-full px-3 py-3 rounded-lg bg-input border-2 border-border text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows={3}
                                />
                                {formErrors.description && <p className="text-red-500 mb-2">{formErrors.description}</p>}
                                <div className="flex justify-between mt-3">
                                    <button
                                        type="button"
                                        onClick={toggleEducationForm}
                                        className="text-white px-4 py-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-text border-2 border-white/30 text-gray-950 font-semibold rounded-lg px-4 py-3"
                                    >
                                        Add Item
                                    </button>
                                </div>
                                {formErrors.maxItems && <p className="text-red-500 mt-2">{formErrors.maxItems}</p>}
                            </form>
                        )}
                    </div>
                )}
            </section>
            <Dialog open={editModalState.isOpen} onOpenChange={(isOpen) => setEditModalState({ ...editModalState, isOpen })}>
                <DialogContent className='bg-card text-text'>
                    <DialogHeader>
                        <DialogTitle>Edit {editModalState.type === 'experience' ? 'Experience' : 'Education'} Item</DialogTitle>
                    </DialogHeader>
                    {editedItem && (
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            if (editModalState.type && editedItem) {
                                handleUpdateItem(editModalState.type, editedItem.id, editedItem)
                            }
                        }}>
                            <input
                                type="text"
                                value={editedItem.title}
                                onChange={(e) => {
                                    setEditedItem({ ...editedItem, title: e.target.value })
                                    validateSectionItem({ ...editedItem, title: e.target.value }, editModalState.type || 'experience')
                                }}
                                placeholder="Title"
                                className="flex-1 min-w-0 mb-3 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {formErrors.title && <p className="text-red-500 mb-2">{formErrors.title}</p>}
                            <textarea
                                value={editedItem.description}
                                onChange={(e) => {
                                    setEditedItem({ ...editedItem, description: e.target.value })
                                    validateSectionItem({ ...editedItem, description: e.target.value }, editModalState.type || 'experience')
                                }}
                                placeholder="Description"
                                className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                rows={3}
                            />
                            {formErrors.description && <p className="text-red-500 mb-2">{formErrors.description}</p>}
                            <DialogFooter>
                                <button
                                    type="submit"
                                    className="bg-text border-2 border-white/30 text-gray-950 font-semibold mt-3 w-full rounded-lg px-4 py-3"
                                >
                                    Save Changes
                                </button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={sectionNameModalState.isOpen} onOpenChange={(isOpen) => setSectionNameModalState({ ...sectionNameModalState, isOpen })}>
                <DialogContent className='bg-card text-text'>
                    <DialogHeader>
                        <DialogTitle>Edit Section Name</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        if (sectionNameModalState.type) {
                            handleUpdateSectionName(sectionNameModalState.type, newSectionName)
                        }
                    }}>
                        <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => {
                                setNewSectionName(e.target.value)
                                validateSectionName(e.target.value)
                            }}
                            placeholder="New Section Name"
                            className="flex-1 min-w-0 mb-3 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {formErrors.sectionName && <p className="text-red-500 mb-2">{formErrors.sectionName}</p>}
                        <DialogFooter>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}