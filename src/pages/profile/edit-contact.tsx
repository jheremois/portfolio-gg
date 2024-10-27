import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import Image from 'next/image'

const validationSchema = Yup.object().shape({
  formsparkCode: Yup.string().required('Formspark code is required'),
})

export default function ContactSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [formsparkCode, setFormsparkCode] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user) {
      fetchContactSettings()
    }
  }, [status, session, router])

  const fetchContactSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/getUser')
      const data = await response.json()

      if (response.ok) {
        setFormsparkCode(data.formspark || '')
      } else {
        toast.error('Failed to load contact settings')
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error)
      toast.error('An error occurred while loading contact settings.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: { formsparkCode: string }, { setSubmitting }: any) => {
    try {
      const response = await fetch('/api/update-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formsparkCode: values.formsparkCode }),
      })

      if (response.ok) {
        toast.success('Contact settings updated successfully')
      } else {
        throw new Error('Failed to update contact settings')
      }
    } catch (err) {
      toast.error('An error occurred while updating your contact settings. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center min-h-[30rem] justify-center bg-background text-title">
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
          Loading your contact settings...
        </motion.p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-text container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >

      <h1 className="text-3xl font-bold mb-6">Contact Form Settings</h1>
      <div className="shadow-lg rounded-lg max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Formspark Integration</h2>
        <p className="mb-4 text-muted-foreground">
          Formspark allows you to easily add a contact form to your portfolio without any backend code.
          Enter your Formspark form ID below to enable the contact form on your profile.
        </p>
        <Formik
          initialValues={{ formsparkCode }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="formsparkCode" className="block text-sm font-medium mb-2">
                  Formspark Form ID
                </label>
                <Field
                  type="text"
                  id="formsparkCode"
                  name="formsparkCode"
                  className="block w-full px-3 py-3 rounded-lg bg-input border-2 border-white/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Formspark form ID"
                />
                <ErrorMessage name="formsparkCode" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-3.5 px-4 text-lg rounded-lg transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Contact Settings'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Sign up for a free account at <a href="https://formspark.io" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Formspark.io</a></li>
            <li>Create a new form and copy the form ID</li>
            <li>Paste the form ID in the field above and click "Update Contact Settings"</li>
            <li>A "Contact" button will now appear on your public profile</li>
            <li>When visitors submit the form, you'll receive an email notification</li>
          </ol>
        </div>
      </div>
    </motion.div>
  )
}