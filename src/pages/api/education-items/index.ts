import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
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

    if (userError) {
        console.error('Error fetching user data:', userError)
        return res.status(500).json({ error: 'Error fetching user data' })
    }

    if (!userData) {
        return res.status(404).json({ error: 'User not found' })
    }

    const user_id = userData.id

    switch (req.method) {
        case 'GET':
            try {
                const { data: items, error: itemsError } = await supabase
                    .from('education_items')
                    .select('*')
                    .eq('user_id', user_id)

                if (itemsError) throw itemsError

                const { data: sectionName, error: sectionError } = await supabase
                    .from('users')
                    .select('education_section_name')
                    .eq('id', user_id)
                    .single()

                if (sectionError) throw sectionError

                return res.status(200).json({
                    items,
                    sectionName: sectionName?.education_section_name || 'Education'
                })
            } catch (error) {
                console.error('Error fetching education items:', error)
                return res.status(500).json({ error: 'Error fetching education items' })
            }

        case 'POST':
            try {
                const { title, description } = req.body

                if (!title || !description) {
                    return res.status(400).json({ error: 'Missing required fields' })
                }

                const { data, error } = await supabase
                    .from('education_items')
                    .insert({ user_id, title, description })
                    .select()
                    .single()

                if (error) throw error

                if (!data) {
                    throw new Error('No data returned from insert operation')
                }

                console.log('Inserted education item:', data)
                return res.status(201).json(data)
            } catch (error) {
                console.error('Error adding education item:', error)
                return res.status(500).json({ error: 'Error adding education item' })
            }

        default:
            res.setHeader('Allow', ['GET', 'POST'])
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}