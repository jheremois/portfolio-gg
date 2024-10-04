import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import EditProfile from '@/components/EditProfile'
import Head from 'next/head'

export default function FirstTimeSetup() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated' && session?.user) {
      checkProfileCompletion()
    }
  }, [status, session, router])

  const checkProfileCompletion = async () => {
    try {
      const response = await fetch('/api/getUser')
      const data = await response.json()

      if (response.ok) {
        if (data.profession) {
          // If the user already has a profession set, redirect to the main profile page
          router.push('/profile')
        } else {
          setIsLoading(false)
        }
      } else {
        toast.error('Failed to load profile data')
        router.push('/profile')
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('An error occurred while loading profile data.')
      router.push('/profile')
    }
  }

  const handleEditComplete = () => {
    router.push('/profile')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background text-text container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Head>
        <title>Welcome to PortfolioGG - Set Up Your Profile</title>
        <meta name="description" content="Set up your PortfolioGG profile and showcase your skills to the world." />
      </Head>

      <header className='text-center mb-7'>
        <h1 className='font-semibold text-title text-2xl sm:text-3xl mb-2'>
          Welcome to PortfolioGG!
        </h1>
        <p className='text-text'>
          Let's create your portfolio. We'll start with some basic information.
        </p>
      </header>

      <EditProfile funcion={handleEditComplete} />
    </div>
  )
}