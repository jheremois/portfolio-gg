import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems: any = [
    /* { name: 'Home', href: '/' },
    { name: 'Go to Portfolio', href: '/portfolio' }, */
  ]

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 border-white/10 ${isScrolled ? 'bg-background/80 border-b-2 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-start lg:w-0 lg:flex-1"
          >
            <Link href="/">
              <span className="sr-only">Portfoliogg</span>
              <img
                className="h-8 w-auto object-cover sm:h-8"
                src="/geekguysstuido.png"
                alt="Portfoliogg Logo"
              />
            </Link>
          </motion.div>
          {/* <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="bg-background/10 rounded-full p-2 inline-flex items-center justify-center text-text hover:text-blue-600 hover:bg-background/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  exit={{ rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div> */}
          <nav className="hidden md:flex space-x-10">
            {navItems.map((item: any, index: any) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-base font-medium text-text hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-end md:flex-1 lg:w-0"
          >
            <Link
              href="/profile"
              className="group ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out"
            >
              Go to Portfolio
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item: any) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-text hover:text-blue-600 hover:bg-blue-100/10 transition duration-150 ease-in-out"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200/20">
              <div className="px-2">
                <Link
                  href="/portfolio"
                  className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition duration-150 ease-in-out"
                >
                  Go to Portfolio
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}