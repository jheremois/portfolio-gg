import {ArrowDownLeftIcon} from "@heroicons/react/24/outline"
import Link from "next/link"

interface projectProperties {
    imgBg: string
    title: string
    description: string
    bgColor: string
    projectUrl: string
    onLoad?: any
}

const Project = (prjct: projectProperties)=>{
    return(
        <>
            <div 
                style={{
                    backgroundImage: `url(${prjct.imgBg})`,
                    backgroundColor: `#${prjct.imgBg}`,
                    backgroundPosition: "0px 60px"
                }}
                className="moveTopDel w-full bg rounded-3xl h-[22rem] ring-1 ring-gray-200/10 bg-no-repeat bg-cover overflow-hidden"
            >
                <div 
                    className="h-56 p-6  bg-black"
                    style={{
                        background: `
                        linear-gradient(179.99deg, ${prjct.bgColor} 34.45%, ${prjct.bgColor}00 68.86%)`
                    }}
                >
                    <div 
                        className="flex items-start gap-2 justify-between"
                    >
                        <div className="">
                            <p className="font-semibold text-lg text-title">
                                {prjct.title}
                            </p>
                            <p className="text-text">
                                {prjct.description}
                            </p>
                        </div>
                        <Link
                            href={prjct.projectUrl}
                            target="_blank"
                            className="
                                bg-gray-50 rounded-full flex items-center justify-center
                                text-black p-3 -rotate-180 hover:scale-125 duration-150
                            "
                        >
                            <ArrowDownLeftIcon width={16}/>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Project