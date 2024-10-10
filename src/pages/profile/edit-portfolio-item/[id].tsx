import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Loader2 } from 'lucide-react'

const validationSchema = Yup.object().shape({
    portfolio_name: Yup.string().required('Portfolio name is required').max(50, 'Name must be 50 characters or less'),
    color: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').required('Color is required'),
    description: Yup.string().required('Description is required').max(500, 'Description must be 500 characters or less'),
    link: Yup.string().url('Invalid URL').required('Link is required'),
})

interface PortfolioItem {
    id: string
    portfolio_name: string
    color: string
    description: string
    link: string
    image_url: string
}

export default function EditPortfolioItem() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { id } = router.query
    const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && id) {
            fetchPortfolioItem()
        }
    }, [status, router, id])

    const fetchPortfolioItem = async () => {
        if (!id) return

        try {
            const response = await fetch(`/api/portfolioItems/${id}`)
            if (response.ok) {
                const data = await response.json()
                setPortfolioItem(data)
                setImagePreview(data.image_url)
            } else {
                toast.error('Failed to fetch portfolio item')
            }
        } catch (error) {
            console.error('Error fetching portfolio item:', error)
            toast.error('An error occurred while fetching the portfolio item')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB')
                return
            }
            setImageFile(file)
            setFieldValue('image', file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        if (!id) return

        const formData = new FormData()
        formData.append('portfolio_name', values.portfolio_name)
        formData.append('color', values.color)
        formData.append('description', values.description)
        formData.append('link', values.link)
        if (imageFile) {
            formData.append('image', imageFile)
        }

        try {
            const response = await fetch(`/api/portfolioItems/edit/${id}`, {
                method: 'PUT',
                body: formData,
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Portfolio item updated successfully')
                router.push('/profile/edit-portfolio-item/list')
            } else {
                toast.error(data.error || 'Failed to update portfolio item')
            }
        } catch (error) {
            console.error('Error updating portfolio item:', error)
            toast.error('An error occurred while updating the portfolio item')
        } finally {
            setSubmitting(false)
        }
    }

    if (isLoading) {
        return (
                <div className="min-h-screen text-text flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
        )
    }

    if (!portfolioItem) {
        return (

                <div className="min-h-screen text-text flex items-center justify-center">
                    Portfolio item not found
                </div>
        )
    }

    return (
        <div className="min-h-screen text-text p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Edit Portfolio Item</h1>
                <Formik
                    initialValues={{
                        portfolio_name: portfolioItem.portfolio_name,
                        color: portfolioItem.color,
                        description: portfolioItem.description,
                        link: portfolioItem.link,
                        image: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="portfolio_name" className="block text-sm font-medium mb-1">
                                        Portfolio Name
                                    </label>
                                    <Field
                                        type="text"
                                        id="portfolio_name"
                                        name="portfolio_name"
                                        className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        maxLength={50}
                                    />
                                    <ErrorMessage name="portfolio_name" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                {/*  <div>
                                    <label htmlFor="color" className="block text-sm font-medium mb-1">
                                        Color
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <Field
                                            type="color"
                                            id="color"
                                            name="color"
                                            className="h-10 w-10 rounded-md border border-gray-600 cursor-pointer"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue('color', e.target.value)
                                            }}
                                        />
                                        <Field
                                            type="text"
                                            name="color"
                                            className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="e.g., #FFFFFF"
                                        />
                                    </div>
                                    <ErrorMessage name="color" component="p" className="text-red-500 text-xs mt-1" />
                                </div> */}

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                                        Description
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="description"
                                        name="description"
                                        className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                                    <p className="text-xs text-gray-400 mt-1">{500 - values.description.length} characters remaining</p>
                                </div>

                                <div>
                                    <label htmlFor="link" className="block text-sm font-medium mb-1">
                                        Link
                                    </label>
                                    <Field
                                        type="text"
                                        id="link"
                                        name="link"
                                        className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage name="link" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Project Image</label>
                                    <div className="flex flex-col lg:flex-row text-center lg:text-start items-center lg:gap-8">
                                        <div className="flex w-full lg:w-fit">
                                            <div className="w-full h-auto lg:w-64 lg:h-64 mx-auto bg-gray-700 rounded-lg overflow-hidden mb-4">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Project" className="w-full h-full object-cover" />
                                                ) : (
                                                    portfolioItem.image_url && (
                                                        <img src={portfolioItem.image_url} alt="Project" className="w-full h-full object-cover" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start h-full lg:h-auto justify-center w-full lg:w-fit">
                                            <label
                                                htmlFor="image"
                                                className="
                                                    cursor-pointer mb-2 bg-text border-2 rounded-lg border-white/30 text-gray-950 font-semibold py-3
                                                    px-10 mx-auto lg:mx-0 w-full lg:w-fit mt-2
                                                "
                                            >
                                                Upload new photo
                                                <input
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                                                    accept="image/*"
                                                />
                                            </label>
                                            <p className="text-sm text-gray-400 mt-2">At least 800x800 px recommended. JPG or PNG allowed.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => router.push('/profile/edit-portfolio-item/list')}
                                    className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Portfolio Item'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}