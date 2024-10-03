import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { supabase } from '@/supabaseClient';
import { Storage } from '@google-cloud/storage'

const gcpKey = JSON.parse(process.env.GCP_KEY || '{}')
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: gcpKey,
})
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME || '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid portfolio item ID' });
  }

  if (req.method === 'GET') {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();
  
    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      return res.status(500).json({ error: 'Failed to retrieve user data' });
    }
  
    const { data: portfolioItem, error: portfolioError } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', userData.id)
      .single();
  
    if (portfolioError) {
      console.error('Error fetching portfolio item:', portfolioError);
      return res.status(500).json({ error: 'Failed to fetch portfolio item' });
    }
  
    if (!portfolioItem) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
  
    return res.status(200).json(portfolioItem);
  }

  if (req.method === 'DELETE') {

  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (userError || !userData) {
    console.error('Error fetching user:', userError)
    return res.status(500).json({ error: 'Failed to retrieve user data' })
  }

  if (req.method === 'DELETE') {
    // Fetch the portfolio item to get the image URL
    const { data: portfolioItem, error: fetchError } = await supabase
      .from('portfolio_items')
      .select('image_url')
      .eq('id', id)
      .eq('user_id', userData.id)
      .single()

    if (fetchError) {
      console.error('Error fetching portfolio item:', fetchError)
      return res.status(500).json({ error: 'Failed to fetch portfolio item' })
    }

    if (!portfolioItem) {
      return res.status(404).json({ error: 'Portfolio item not found' })
    }

    // Delete the image from Google Cloud Storage if it exists
    if (portfolioItem.image_url) {
      const fileName = portfolioItem.image_url.split('/').pop()
      if (fileName) {
        try {
          await bucket.file(`portfolio-images/${fileName}`).delete()
        } catch (deleteError) {
          console.error('Error deleting image from storage:', deleteError)
          // Continue with deletion even if image deletion fails
        }
      }
    }

    // Delete the portfolio item from the database
    const { error: deleteError } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.id)

    if (deleteError) {
      console.error('Error deleting portfolio item:', deleteError)
      return res.status(500).json({ error: 'Failed to delete portfolio item' })
    }

    return res.status(200).json({ message: 'Portfolio item deleted successfully' })
  } else {
    res.setHeader('Allow', ['DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

}