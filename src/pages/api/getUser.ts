import { supabase } from '@/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: any, res: any) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, username, name, profession, description, profile_image')
      .eq('email', session.user.email)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile', details: error });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Unexpected error in getUser:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}