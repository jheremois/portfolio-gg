import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch skills' });
  }

  res.status(200).json(data);
}