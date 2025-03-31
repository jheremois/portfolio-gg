import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070708] via-[#0a0a0e] to-[#070708] text-[#e5e7ebf2] flex flex-col">

      {/* Hero Content */}
      <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center max-w-5xl pt-20 pb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 uppercase leading-tight">
          <span className="text-[#F4F4F4]">Simplify Your Portfolio,</span>
          <br />
          <span className="text-[#F4F4F4]">Amplify Your</span>
          <span className="text-[#2563eb]"> Career.</span>
        </h1>

        <p className="text-xl md:text-2xl mb-12 max-w-3xl text-[#e5e7ebf2]/80">
          Create an impactful professional profile in minutes. No hassle, no coding, and completely free. Your
          professional presence, simplified.
        </p>

        <Link
          href="/login"
          className="bg-[#2563eb] text-[#F4F4F4] px-8 py-4 rounded-full flex items-center gap-2 text-lg font-medium hover:bg-[#2563eb]/90 transition-colors shadow-lg shadow-[#2563eb]/20"
        >
          Get Started <ArrowRight className="ml-1" size={20} />
        </Link>
      </div>

      {/* Modern Card Section */}
      <div className="container mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 - Portfolio Preview */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/20 to-[#2563eb]/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-[#111113]/80 backdrop-blur-md p-8 rounded-2xl border border-[#2a2a2c] h-full flex flex-col transform transition-all duration-300 group-hover:translate-y-[-5px] group-hover:shadow-xl group-hover:shadow-[#2563eb]/5">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#2563eb]/70 rounded-2xl mb-6 flex items-center justify-center shadow-lg shadow-[#2563eb]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[#F4F4F4]">Professional Design</h3>
            <p className="text-[#e5e7ebf2]/70 mb-6">
              Elegant and modern templates ready to showcase your work instantly.
            </p>
          </div>
        </div>

        {/* Card 2 - Quick Setup */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/10 to-[#2563eb]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-[#111113]/80 backdrop-blur-md p-8 rounded-2xl border border-[#2a2a2c] h-full flex flex-col transform transition-all duration-300 group-hover:translate-y-[-5px] group-hover:shadow-xl group-hover:shadow-[#2563eb]/5">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb]/90 to-[#2563eb]/60 rounded-2xl mb-6 flex items-center justify-center shadow-lg shadow-[#2563eb]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[#F4F4F4]">Quick Creation</h3>
            <p className="text-[#e5e7ebf2]/70 mb-6">Set up your complete portfolio in minutes, not days or weeks.</p>
          </div>
        </div>

        {/* Card 3 - Sharing */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/15 to-[#2563eb]/15 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-[#111113]/80 backdrop-blur-md p-8 rounded-2xl border border-[#2a2a2c] h-full flex flex-col transform transition-all duration-300 group-hover:translate-y-[-5px] group-hover:shadow-xl group-hover:shadow-[#2563eb]/5">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb]/80 to-[#2563eb]/50 rounded-2xl mb-6 flex items-center justify-center shadow-lg shadow-[#2563eb]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[#F4F4F4]">Easy to Share</h3>
            <p className="text-[#e5e7ebf2]/70 mb-6">One unique link for all your professional presence and projects.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

