'use client'

import { useState } from 'react'
import { ArrowDownLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectProperties {
    imgBg: string
    title: string
    description: string
    bgColor: string
    projectUrl: string
    onLoad?: () => void
}

const Project = (prjct: ProjectProperties) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${prjct.imgBg})`,
                    backgroundColor: prjct.bgColor,
                    backgroundPosition: "0px 0px"
                }}
                className="moveTopDel w-full rounded-3xl h-[22rem] relative border-4 border-border bg-no-repeat bg-cover overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setIsModalOpen(true)}
                onLoad={prjct.onLoad}
            >
                <div
                    className="p-6 bg-neutral-900/85 max-h-24 border-t-2 border-border backdrop-blur-lg bottom-0 absolute w-full transition-all duration-300 hover:max-h-full group"
                >
                    <div
                        className="flex items-center gap-2 justify-between"
                    >
                        <p className="font-semibold text-lg text-title text-nowrap text-ellipsis overflow-hidden group-hover:text-wrap group-hover:text-clip">
                            {prjct.title}
                        </p>
                        <Link
                            href={prjct.projectUrl}
                            target="_blank"
                            className="
                                bg-gray-50 rounded-full flex items-center justify-center
                                text-black p-3 -rotate-180 hover:scale-125 duration-150
                            "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ArrowDownLeftIcon width={16} />
                        </Link>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogContent className="sm:max-w-[300px] md:max-w-[80vw] lg:max-w-[700px] max-h-[92vh] w-[95vw] overflow-auto bg-neutral-900 text-white border-2 border-border p-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                            >
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <img
                                        src={prjct.imgBg}
                                        alt={prjct.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black transition-colors duration-200"
                                >
                                    <XMarkIcon className="w-6 h-6 text-white" />
                                </button>
                                <div className="p-4 sm:p-6">
                                    <DialogTitle className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
                                            {prjct.title}
                                    </DialogTitle>
                                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">{prjct.description}</p>
                                    <div className="flex justify-end">
                                        <Link
                                            href={prjct.projectUrl}
                                            target="_blank"
                                            className="
                                                px-4 sm:px-6 py-2 sm:py-3 w-full text-center justify-center flex items-center gap-2 rounded-xl font-semibold text-sm sm:text-base
                                                bg-white text-neutral-900 hover:bg-gray-200 transition-colors duration-200
                                            "
                                        >
                                            Visit Project
                                            <div
                                                className="
                                                    rounded-full font-semibold flex items-center justify-center
                                                    text-black -rotate-180 hover:scale-105 duration-150
                                                "
                                            >
                                                <ArrowDownLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    )
}

export default Project