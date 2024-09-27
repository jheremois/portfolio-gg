import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Skill {
    id: string
    skill_name: string
}

interface SectionItem {
    id: string
    title: string
    description: string
}

interface EditModalState {
    isOpen: boolean
    type: 'experience' | 'education' | null
    item: SectionItem | null
}

interface SectionNameModalState {
    isOpen: boolean
    type: 'experience' | 'education' | null
}

interface FormErrors {
    [key: string]: string
}

const MAX_SKILLS = 8
const MAX_ITEMS = 4

export default function EditProfile() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [skills, setSkills] = useState<Skill[]>([])
    const [newSkill, setNewSkill] = useState('')
    const [experienceItems, setExperienceItems] = useState<SectionItem[]>([])
    const [educationItems, setEducationItems] = useState<SectionItem[]>([])
    const [experienceSectionName, setExperienceSectionName] = useState('Experience')
    const [educationSectionName, setEducationSectionName] = useState('Education')
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

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        } else if (status === 'authenticated') {
            fetchSkills()
            fetchExperienceItems()
            fetchEducationItems()
        }
    }, [status, router])

    const fetchSkills = async () => {
        try {
            const response = await fetch('/api/skills')
            const data = await response.json()
            console.log('Skills data:', data)
            if (response.ok) {
                const filteredSkills = (data || []).filter((skill: Skill | null) => 
                    skill && typeof skill === 'object' && 'id' in skill && 'skill_name' in skill
                ).slice(0, MAX_SKILLS)
                console.log('Filtered skills:', filteredSkills)
                setSkills(filteredSkills)
            } else {
                toast.error('Failed to load skills')
            }
        } catch (error) {
            console.error('Error fetching skills:', error)
            toast.error('An error occurred while loading skills.')
        }
    }

    const fetchExperienceItems = async () => {
        try {
            const response = await fetch('/api/experience-items')
            const data = await response.json()
            console.log('Experience items data:', data)
            if (response.ok) {
                const filteredItems = (data.items || []).filter((item: SectionItem | null) => 
                    item && typeof item === 'object' && 'id' in item && 'title' in item && 'description' in item
                ).slice(0, MAX_ITEMS)
                console.log('Filtered experience items:', filteredItems)
                setExperienceItems(filteredItems)
                setExperienceSectionName(data.sectionName || 'Experience')
            } else {
                toast.error('Failed to load experience items')
            }
        } catch (error) {
            console.error('Error fetching experience items:', error)
            toast.error('An error occurred while loading experience items.')
        }
    }

    const fetchEducationItems = async () => {
        try {
            const response = await fetch('/api/education-items')
            const data = await response.json()
            console.log('Education items data:', data)
            if (response.ok) {
                const filteredItems = (data.items || []).filter((item: SectionItem | null) => 
                    item && typeof item === 'object' && 'id' in item && 'title' in item && 'description' in item
                ).slice(0, MAX_ITEMS)
                console.log('Filtered education items:', filteredItems)
                setEducationItems(filteredItems)
                setEducationSectionName(data.sectionName || 'Education')
            } else {
                toast.error('Failed to load education items')
            }
        } catch (error) {
            console.error('Error fetching education items:', error)
            toast.error('An error occurred while loading education items.')
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
        if (skills.length >= MAX_SKILLS) {
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
                setSkills(prevSkills => [...prevSkills, data as Skill].slice(0, MAX_SKILLS))
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
            });

            const data = await response.json();
            console.log('Delete skill response:', data)

            if (response.ok) {
                setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
                toast.success('Skill deleted successfully');
            } else {
                throw new Error(data.error || 'Failed to delete skill');
            }
        } catch (error: any) {
            console.error('Error deleting skill:', error);
            toast.error(`An error occurred while deleting the skill: ${error.message}`);
        }
    };

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

        const items = section === 'experience' ? experienceItems : educationItems
        if (items.length >= MAX_ITEMS) {
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
                setExperienceItems(prevItems => [...prevItems, data as SectionItem].slice(0, MAX_ITEMS))
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
                setEducationItems(prevItems => [...prevItems, data as SectionItem].slice(0, MAX_ITEMS))
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
                if (section === 'experience') {
                    setExperienceItems(prevItems => prevItems.map(item => item.id === itemId ? updatedItem : item))
                } else {
                    setEducationItems(prevItems => prevItems.map(item => item.id === itemId ? updatedItem : item))
                }
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
            console.log(`Delete ${section} item response:`, data)

            if (response.ok) {
                if (section === 'experience') {
                    setExperienceItems(prevItems => prevItems.filter(item => item.id !== itemId))
                } else {
                    setEducationItems(prevItems => prevItems.filter(item => item.id !== itemId))
                }
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

    const handleUpdateSectionName = async (section: 'experience' | 'education', newName: string) => {
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
                if (section === 'experience') {
                    setExperienceSectionName(newName)
                } else {
                    setEducationSectionName(newName)
                }
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

    const openSectionNameModal = (type: 'experience' | 'education') => {
        setSectionNameModalState({ isOpen: true, type })
        setNewSectionName(type === 'experience' ? experienceSectionName : educationSectionName)
    }

    if (status === 'loading') {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Skills ({skills.length}/{MAX_SKILLS})</h2>
                <form onSubmit={handleAddSkill} className="mb-4">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => {
                            setNewSkill(e.target.value)
                            validateSkill(e.target.value)
                        }}
                        placeholder="Enter a new skill"
                        className="border rounded px-3 py-2 mr-2"
                        disabled={skills.length >= MAX_SKILLS}
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                        disabled={skills.length >= MAX_SKILLS}
                    >
                        Add Skill
                    </button>
                    {formErrors.newSkill && <p className="text-red-500 mt-1">{formErrors.newSkill}</p>}
                </form>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <div key={skill.id} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                            <span>{skill.skill_name}</span>
                            <button
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                                aria-label={`Delete ${skill.skill_name} skill`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{experienceSectionName} ({experienceItems.length}/{MAX_ITEMS})</h2>
                    <button
                        onClick={() => openSectionNameModal('experience')}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Edit Name
                    </button>
                </div>
                {experienceItems.map((item) => (
                    <div key={item.id} className="mb-4 p-4 border rounded">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="mb-2">{item.description}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => openEditModal('experience', item)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteItem('experience', item.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {experienceItems.length < MAX_ITEMS && (
                    <form onSubmit={handleAddExperienceItem} className="mb-4 p-4 border rounded">
                        <input
                            type="text"
                            value={newExperienceItem.title}
                            onChange={(e) => {
                                setNewExperienceItem({ ...newExperienceItem, title: e.target.value })
                                validateSectionItem({ ...newExperienceItem, title: e.target.value }, 'experience')
                            }}
                            placeholder="Title"
                            className="w-full border rounded px-3 py-2 mb-2"
                        />
                        {formErrors.title && <p className="text-red-500 mb-2">{formErrors.title}</p>}
                        <textarea
                            value={newExperienceItem.description}
                            onChange={(e) => {
                                setNewExperienceItem({ ...newExperienceItem, description: e.target.value })
                                validateSectionItem({ ...newExperienceItem, description: e.target.value }, 'experience')
                            }}
                            placeholder="Description"
                            className="w-full border rounded px-3 py-2 mb-2"
                            rows={3}
                        />
                        {formErrors.description && <p className="text-red-500 mb-2">{formErrors.description}</p>}
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Add Experience
                        </button>
                        {formErrors.maxItems && <p className="text-red-500 mt-2">{formErrors.maxItems}</p>}
                    </form>
                )}
            </section>

            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{educationSectionName} ({educationItems.length}/{MAX_ITEMS})</h2>
                    <button
                        onClick={() => openSectionNameModal('education')}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Edit Name
                    </button>
                </div>
                {educationItems.map((item) => (
                    <div key={item.id} className="mb-4 p-4 border rounded">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="mb-2">{item.description}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => openEditModal('education', item)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteItem('education', item.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {educationItems.length < MAX_ITEMS && (
                    <form onSubmit={handleAddEducationItem} className="mb-4 p-4 border rounded">
                        <input
                            type="text"
                            value={newEducationItem.title}
                            onChange={(e) => {
                                setNewEducationItem({ ...newEducationItem, title: e.target.value })
                                validateSectionItem({ ...newEducationItem, title: e.target.value }, 'education')
                            }}
                            placeholder="Title"
                            className="w-full border rounded px-3 py-2 mb-2"
                        />
                        {formErrors.title && <p className="text-red-500 mb-2">{formErrors.title}</p>}
                        <textarea
                            value={newEducationItem.description}
                            onChange={(e) => {
                                setNewEducationItem({ ...newEducationItem, description: e.target.value })
                                validateSectionItem({ ...newEducationItem, description: e.target.value }, 'education')
                            }}
                            placeholder="Description"
                            className="w-full border rounded px-3 py-2 mb-2"
                            rows={3}
                        />
                        {formErrors.description && <p className="text-red-500 mb-2">{formErrors.description}</p>}
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Add Education
                        </button>
                        {formErrors.maxItems && <p className="text-red-500 mt-2">{formErrors.maxItems}</p>}
                    </form>
                )}
            </section>

            <button
                onClick={() => router.push('/profile')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
                Save and Return to Profile
            </button>

            <Dialog open={editModalState.isOpen} onOpenChange={(isOpen) => setEditModalState({ ...editModalState, isOpen })}>
                <DialogContent>
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
                                className="w-full border rounded px-3 py-2 mb-2"
                            />
                            {formErrors.title && <p className="text-red-500 mb-2">{formErrors.title}</p>}
                            <textarea
                                value={editedItem.description}
                                onChange={(e) => {
                                    setEditedItem({ ...editedItem, description: e.target.value })
                                    validateSectionItem({ ...editedItem, description: e.target.value }, editModalState.type || 'experience')
                                }}
                                placeholder="Description"
                                className="w-full border rounded px-3 py-2 mb-2"
                                rows={3}
                            />
                            {formErrors.description && <p className="text-red-500 mb-2">{formErrors.description}</p>}
                            <DialogFooter>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={sectionNameModalState.isOpen} onOpenChange={(isOpen) => setSectionNameModalState({ ...sectionNameModalState, isOpen })}>
                <DialogContent>
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
                            className="w-full border rounded px-3 py-2 mb-2"
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