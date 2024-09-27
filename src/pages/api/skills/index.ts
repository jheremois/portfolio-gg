// pages/api/skills.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { supabase } from '@/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user?.email) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const { data: userData, error: userError }: any = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle();

    const user_id = userData.id;

    const userEmail = session.user.email

    switch (req.method) {
        case 'GET':
            try {
                // First, get the user's ID from their email
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', userEmail)
                    .single()

                if (userError) throw userError

                if (!userData || !userData.id) {
                    return res.status(404).json({ error: 'User not found' })
                }

                const userId = userData.id

                const { data, error } = await supabase
                    .from('skills')
                    .select('*')
                    .eq('user_id', userId)

                if (error) throw error

                return res.status(200).json(data)
            } catch (error) {
                console.error('Error fetching skills:', error)
                return res.status(500).json({ error: 'Error fetching skills' })
            }

        case 'POST':
            try {
                const { skill_name } = req.body

                if (!skill_name) {
                    return res.status(400).json({ error: 'Skill name is required' })
                }

                const { data, error } = await supabase
                    .from('skills')
                    .insert({ user_id, skill_name })
                    .select()
                    .single()

                if (error) throw error

                if (!data) {
                    throw new Error('No data returned from insert operation')
                }

                return res.status(201).json(data)
            } catch (error: any) {
                console.error('Error adding skill:', error)
                return res.status(500).json({ error: 'Error adding skill', details: error.message })
            }

        default:
            res.setHeader('Allow', ['GET', 'POST'])
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}