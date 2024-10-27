import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react';

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
              <li><strong>Rename Section:</strong> Change the "Projects" name to fit what you're showcasing.</li>
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
                        className="bg-card text-title border-gray-200/20 rounded-2xl shadow-xl w-[95vw] max-w-4xl max-h-[90svh] overflow-hidden"
                    >
                        <div className="flex flex-col h-full">
                            {/* <div className="flex justify-between items-center p-6 border-b border-gray-200/20">
                                <h2 className="text-2xl font-bold">{steps[step - 1].title}</h2>
                            </div> */}
                            <div className="flex-grow overflow-y-auto h-[65vh] p-5">
                                <div className="flex justify-between items-center py-4 border-b border-gray-200/20">
                                    <h2 className="text-2xl font-bold">{steps[step - 1].title}</h2>
                                </div>
                                <div className="prose prose-invert max-w-none mt-4">
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

export default FirstTimeWalkthrough