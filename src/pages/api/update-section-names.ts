import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { supabase } from '@/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (userError || !userData) {
    return res.status(404).json({ error: 'User not found' })
  }

  const user_id = userData.id

  if (req.method === 'PUT') {
    try {
      const { 
        experience_section_name, 
        education_section_name, 
        skills_section_name, 
        projects_section_name 
      } = req.body

      const updateData: { [key: string]: string } = {}
      if (experience_section_name) updateData.experience_section_name = experience_section_name
      if (education_section_name) updateData.education_section_name = education_section_name
      if (skills_section_name) updateData.skills_section_name = skills_section_name
      if (projects_section_name) updateData.projects_section_name = projects_section_name

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No section names provided for update' })
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user_id)
        .select()

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error updating section names:', error)
      return res.status(500).json({ error: 'Error updating section names' })
    }
  }

  res.setHeader('Allow', ['PUT'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}