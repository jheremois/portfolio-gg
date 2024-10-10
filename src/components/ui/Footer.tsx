import React from 'react'
import Link from 'next/link'
import { Instagram, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-gray-200/20 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-20">
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/geekguysstuido.png" alt="Geek Guys Studio" width={32} height={32} />
            </Link>
            <p className="text-text text-sm sm:text-base leading-6">
              Create and showcase your professional portfolio with ease.
            </p>
            <div className="flex space-x-6">
              <a target='_blank' href="https://www.instagram.com/geekguysstudio" className="text-text hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-110">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6">
            <div>
              <h3 className="text-sm font-semibold text-title tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/terms-of-service" className="text-sm sm:text-base text-text hover:text-blue-600 transition duration-300 ease-in-out">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm sm:text-base text-text hover:text-blue-600 transition duration-300 ease-in-out">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-title tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <a target='_blank' href="https://www.geekguysstudio.com" className="text-sm sm:text-base text-text hover:text-blue-600 transition duration-300 ease-in-out">
                    Geek Guys Studio
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <h3 className="text-sm font-semibold text-title tracking-wider uppercase mb-4">
              Get Started
            </h3>
            <div>
              <Link 
                href="/profile" 
                className="
                    inline-flex items-center px-4 py-2 border-2
                    border-blue-50 text-sm sm:text-base font-medium rounded-full text-blue-50 bg-white/5 
                    hover:bg-blue-600 hover:border-blue-50 hover:text-white transition duration-300 ease-in-out
                "
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 border-t border-gray-200/50 dark:border-gray-800 pt-8">
          <p className="text-sm sm:text-base text-text text-center">
            &copy; {currentYear} Portfoliogg. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}