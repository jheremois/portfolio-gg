import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { supabase } from '@/supabaseClient';

export default async function handler(req: any, res: any) {
  // Ensure only authenticated users can access this API
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Fetch the user from the Supabase database
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id') // Only need the user's ID to query the portfolio items
    .eq('email', session.user.email)
    .maybeSingle();

  if (userError || !userData) {
    return res.status(500).json({ error: 'Failed to retrieve user data' });
  }

  const userId = userData.id;

  // Query all portfolio items that belong to this user
  const { data: portfolioItems, error: portfolioError } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('user_id', userId);

  if (portfolioError) {
    return res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }

  // Return the portfolio items in the response
  return res.status(200).json({ portfolioItems });
}
