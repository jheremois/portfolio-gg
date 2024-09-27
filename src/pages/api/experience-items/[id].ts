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
    const { id } = req.query

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid experience item ID' })
    }

    switch (req.method) {
        case 'PUT':
            try {
                const { title, description } = req.body

                if (!title || !description) {
                    return res.status(400).json({ error: 'Missing required fields' })
                }

                const { data, error } = await supabase
                    .from('experience_items')
                    .update({ title, description})
                    .eq('id', id)
                    .eq('user_id', user_id)
                    .select()
                    .single()

                if (error) throw error

                if (!data) {
                    return res.status(404).json({ error: 'experience item not found or not owned by user' })
                }

                console.log('Updated experience item:', data)
                return res.status(200).json(data)
            } catch (error) {
                console.error('Error updating experience item:', error)
                return res.status(500).json({ error: 'Error updating experience item' })
            }

        case 'DELETE':
            try {
                const { data, error } = await supabase
                    .from('experience_items')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user_id)
                    .select()
                    .single()

                if (error) throw error

                if (!data) {
                    return res.status(404).json({ error: 'experience item not found or not owned by user' })
                }

                console.log('Deleted experience item:', data)
                return res.status(200).json({ message: 'experience item deleted successfully', deletedItem: data })
            } catch (error) {
                console.error('Error deleting experience item:', error)
                return res.status(500).json({ error: 'Error deleting experience item' })
            }

        default:
            res.setHeader('Allow', ['PUT', 'DELETE'])
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}