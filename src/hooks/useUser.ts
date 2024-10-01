import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type User = {
  id: string
  username: string
  name: string
  email: string
  profession: string
  description: string
  profile_image: string
}

export function useUser() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const response = await fetch('/api/getUser')
          if (!response.ok) {
            throw new Error('Failed to fetch user data')
          }
          const userData = await response.json()
          setUser({...userData, email: session?.user?.email})
        } catch (e) {
          setError(e instanceof Error ? e.message : 'An unknown error occurred')
        } finally {
          setIsLoading(false)
        }
      } else if (status === 'unauthenticated') {
        setUser(null)
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [status, session])

  return { user, isLoading, error }
}