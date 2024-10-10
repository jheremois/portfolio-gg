import LoginPage from "@/components/Login";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import SEOMetadata from "@/components/ui/SeoMetadata";
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon, SparklesIcon, BoltIcon, ShareIcon, } from '@heroicons/react/24/solid'
import Image from "next/image";

export default function Home() {
  return (
    <>
      <SEOMetadata
        title="Portfoliogg - Create Your Professional Portfolio"
        description="Portfoliogg is a user-friendly platform for creating and sharing professional portfolios. Showcase your skills, projects, and achievements with ease."
        canonicalUrl="https://www.portfoliogg.com/"
      />
      <Header />
      <div className="min-h-screen bg-background text-text font-body pt-12">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 text-title font-heading leading-tight">
                Your portfolio,
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-buttons"> simplified</span>
              </h1>
              <p className="text-xl sm:text-2xl mb-12 max-w-2xl mx-auto text-text/80">
                Create an impactful professional profile in minutes. No hassle, completely free.
              </p>
              <Link href="/login" className="inline-flex items-center px-8 py-4 bg-buttons text-text rounded-full text-lg font-semibold hover:bg-primary transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Get Started Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted to-background opacity-50"></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-title font-heading">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: SparklesIcon, title: "Professional Design", description: "Elegant and modern templates ready to use." },
                { icon: BoltIcon, title: "Quick Creation", description: "Set up your portfolio in a matter of minutes." },
                { icon: ShareIcon, title: "Easy to Share", description: "A unique link for all your professional presence." },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300"
                >
                  <feature.icon className="h-8 w-8 text-primary mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-title font-heading">{feature.title}</h3>
                  <p className="text-text/80">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-muted">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-title font-heading">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", text: "Sign up with Google" },
                { step: "02", text: "Customize your profile" },
                { step: "03", text: "Share your portfolio" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="text-8xl font-bold text-primary opacity-20 absolute top-0 left-0 -translate-y-1/2">
                    {item.step}
                  </div>
                  <div className="relative z-10 bg-card rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-title font-heading">{item.text}</h3>
                    <p className="text-text/80">Simplified process so you can focus on showcasing your talent.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        {/* <section className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-title font-heading">Portafolios destacados</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Ana García", role: "Diseñadora UX/UI", image: "/placeholder.svg?height=400&width=600&text=Ana" },
                { name: "Carlos Rodríguez", role: "Desarrollador Full Stack", image: "/placeholder.svg?height=400&width=600&text=Carlos" },
                { name: "Laura Martínez", role: "Fotógrafa Profesional", image: "/placeholder.svg?height=400&width=600&text=Laura" }
              ].map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg"
                >
                  <img src={profile.image} alt={profile.name} className="w-full h-80 object-cover transition duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-semibold text-title font-heading">{profile.name}</h3>
                    <p className="text-text/80">{profile.role}</p>
                    <Link href="#" className="mt-4 inline-flex items-center text-primary hover:underline">
                      Ver portafolio
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-title font-heading">Ready to shine?</h2>
              <p className="text-xl mb-12 text-text/80">
                Join the community of professionals who are standing out with Portfolio GG. Your future starts here.
              </p>
              <Link href="/login" className="inline-flex items-center px-8 py-4 bg-buttons text-title rounded-full text-lg font-semibold hover:bg-primary transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Create your free portfolio
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}