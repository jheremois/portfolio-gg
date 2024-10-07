// pages/api/update-contact.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { supabase } from '@/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user?.email) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const userEmail = session.user.email

    switch (req.method) {
        case 'POST':
            try {
                const { formsparkCode } = req.body

                if (!formsparkCode) {
                    return res.status(400).json({ error: 'Formspark code is required' })
                }

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

                // Update the user's formspark code
                const { data, error } = await supabase
                    .from('users')
                    .update({ formspark: formsparkCode })
                    .eq('id', userId)
                    .select()
                    .single()

                if (error) throw error

                if (!data) {
                    throw new Error('No data returned from update operation')
                }

                return res.status(200).json({ message: 'Contact settings updated successfully', data })
            } catch (error: any) {
                console.error('Error updating contact settings:', error)
                return res.status(500).json({ error: 'Error updating contact settings', details: error.message })
            }

        case 'GET':
            try {
                // First, get the user's ID from their email
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, formspark')
                    .eq('email', userEmail)
                    .single()

                if (userError) throw userError

                if (!userData || !userData.id) {
                    return res.status(404).json({ error: 'User not found' })
                }

                return res.status(200).json({ formsparkCode: userData.formspark })
            } catch (error) {
                console.error('Error fetching contact settings:', error)
                return res.status(500).json({ error: 'Error fetching contact settings' })
            }

        default:
            res.setHeader('Allow', ['GET', 'POST'])
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}