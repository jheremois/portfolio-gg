import { supabase } from '@/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: any, res: any) {
  // Use getServerSession for API route
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { email } = session.user;
  const { username, profession } = req.body;

  const { error } = await supabase
    .from('users')
    .update({ username, profession })
    .eq('email', email);

  if (error) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }

  return res.status(200).json({ message: 'Profile updated successfully' });
}
