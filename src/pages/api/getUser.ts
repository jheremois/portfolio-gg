import { supabase } from '@/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('username, name, profession, description, profile_image')
    .eq('email', session.user.email)
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }

  return res.status(200).json(data);
}
