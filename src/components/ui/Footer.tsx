import Link from "next/link"
import { Instagram, ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-[#070708] to-[#0a0a0e] border-t border-[#2a2a2c]/30">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2563eb]/[0.03] to-transparent pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
            <Image src="/geekguysstuido.png" alt="Geek Guys Studio" width={32} height={32} />
            </Link>
            <p className="text-[#e5e7ebf2]/80 text-sm sm:text-base leading-relaxed">
              Create and showcase your professional portfolio with ease. No coding required, completely free, ready in
              minutes.
            </p>
            <div className="flex space-x-6">
              <a
                target="_blank"
                href="https://www.instagram.com/geekguysstudio"
                className="relative group"
                aria-label="Instagram"
                rel="noreferrer"
              >
                <span className="absolute -inset-2 bg-gradient-to-r from-[#2563eb]/20 to-[#2563eb]/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Instagram
                  className="h-6 w-6 text-[#e5e7ebf2] group-hover:text-[#2563eb] transition-colors duration-300 relative"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            {/* Legal Column */}
            <div>
              <h3 className="text-sm font-semibold text-[#F4F4F4] tracking-wider uppercase mb-6 after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#2563eb] after:mt-2">
                Legal
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-sm sm:text-base text-[#e5e7ebf2]/70 hover:text-[#2563eb] transition-colors duration-300 flex items-center group"
                  >
                    <span className="relative overflow-hidden">
                      Terms of Service
                      <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#2563eb] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm sm:text-base text-[#e5e7ebf2]/70 hover:text-[#2563eb] transition-colors duration-300 flex items-center group"
                  >
                    <span className="relative overflow-hidden">
                      Privacy Policy
                      <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#2563eb] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-sm font-semibold text-[#F4F4F4] tracking-wider uppercase mb-6 after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#2563eb] after:mt-2">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    target="_blank"
                    href="https://www.geekguysstudio.com"
                    className="text-sm sm:text-base text-[#e5e7ebf2]/70 hover:text-[#2563eb] transition-colors duration-300 flex items-center group"
                    rel="noreferrer"
                  >
                    <span className="relative overflow-hidden">
                      Geek Guys Studio
                      <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#2563eb] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
                    </span>
                    <ExternalLink className="ml-1 h-3 w-3 opacity-70 group-hover:opacity-100" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Column */}
          <div className="mt-8 lg:mt-0">
            <h3 className="text-sm font-semibold text-[#F4F4F4] tracking-wider uppercase mb-6 after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#2563eb] after:mt-2">
              Get Started
            </h3>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2563eb]/30 to-[#2563eb]/20 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Link
                href="/profile"
                className="relative inline-flex items-center px-6 py-3 border border-[#2563eb]/50 
                  text-sm sm:text-base font-medium rounded-full text-[#F4F4F4] 
                  bg-gradient-to-r from-[#2563eb]/20 to-[#2563eb]/10
                  hover:bg-gradient-to-r hover:from-[#2563eb] hover:to-[#2563eb]/90 
                  hover:border-[#2563eb] hover:text-white 
                  transition-all duration-300 ease-in-out
                  shadow-lg shadow-[#2563eb]/5 hover:shadow-[#2563eb]/20"
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <p className="mt-6 text-xs text-[#e5e7ebf2]/50">
              Join thousands of professionals who have already created their portfolios with us.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#2a2a2c]/30">
          <p className="text-sm text-[#e5e7ebf2]/50 text-center">
            &copy; {currentYear} Portfoliogg. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

