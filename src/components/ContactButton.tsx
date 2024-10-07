import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

interface ContactModalProps {
  username: string
  formsparkId: string
}

const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string().required('Message is required'),
})

export default function ContactModal({ username, formsparkId }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    setSubmitStatus('submitting')
    try {
      const response = await fetch(`https://submit-form.com/${formsparkId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        setSubmitStatus('success')
        resetForm()
        setTimeout(() => {
          setIsOpen(false)
          setSubmitStatus('idle')
        }, 2000)
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      setSubmitStatus('error')
    }
    setSubmitting(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-3 border-2 border-border rounded-xl font-semibold bg-blue-600 w-full text-base"
      >
        Contact
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black text-text bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text">Contact {username}</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-text">
                  <X size={24} />
                </button>
              </div>

              <Formik
                initialValues={{ name: '', email: '', message: '' }}
                validationSchema={ContactSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full px-3 py-3 rounded-lg bg-input border-2 border-border text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="block w-full px-3 py-3 rounded-lg bg-input border-2 border-border text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text">
                        Message
                      </label>
                      <Field
                        as="textarea"
                        name="message"
                        id="message"
                        rows={4}
                        className="block w-full px-3 py-3 rounded-lg bg-input border-2 border-border text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || submitStatus !== 'idle'}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {submitStatus === 'submitting' ? (
                        'Sending...'
                      ) : submitStatus === 'success' ? (
                        'Message Sent!'
                      ) : submitStatus === 'error' ? (
                        'Error. Try Again.'
                      ) : (
                        <>
                          Send <Send size={16} className="ml-2" />
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}