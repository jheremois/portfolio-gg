import { supabase } from '@/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: any, res: any) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, name, profession, description, profile_image')
      .eq('email', session.user.email)
      .single();

    if (userError) {
      console.error('Supabase error fetching user:', userError);
      return res.status(500).json({ error: 'Failed to fetch user profile', details: userError });
    }

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch social links
    const { data: socialLinksData, error: socialLinksError } = await supabase
      .from('social_links')
      .select('platform, link')
      .eq('user_id', userData.id);

    if (socialLinksError) {
      console.error('Supabase error fetching social links:', socialLinksError);
      return res.status(500).json({ error: 'Failed to fetch social links', details: socialLinksError });
    }

    // Combine user data with social links
    const responseData = {
      ...userData,
      socialLinks: socialLinksData || []
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Unexpected error in getUser:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}