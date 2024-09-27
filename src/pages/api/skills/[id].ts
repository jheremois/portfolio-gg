import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { supabase } from '@/supabaseClient'

// Función para validar UUID
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query

  // Validar que id es un string y un UUID válido
  if (typeof id !== 'string' || !isValidUUID(id)) {
    return res.status(400).json({ error: 'Invalid skill ID' })
  }

  if (req.method === 'DELETE') {
    try {
      // Primero, obtener el ID del usuario basado en su email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (userError) throw userError

      if (!userData || !userData.id) {
        return res.status(404).json({ error: 'User not found' })
      }

      const userId = userData.id

      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error

      return res.status(200).json({ message: 'Skill deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting skill:', error)
      return res.status(500).json({ error: 'Error deleting skill', details: error.message })
    }
  }

  res.setHeader('Allow', ['DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}