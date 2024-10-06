import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { supabase } from '@/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, name, profession, description, profile_image, education_section_name, experience_section_name, skills_section_name, projects_section_name')
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

    // Fetch skills
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userData.id);

    if (skillsError) {
      console.error('Supabase error fetching skills:', skillsError);
      return res.status(500).json({ error: 'Failed to fetch skills', details: skillsError });
    }

    // Fetch education items
    const { data: educationData, error: educationError } = await supabase
      .from('education_items')
      .select('*')
      .eq('user_id', userData.id);

    if (educationError) {
      console.error('Supabase error fetching education items:', educationError);
      return res.status(500).json({ error: 'Failed to fetch education items', details: educationError });
    }

    // Fetch experience items
    const { data: experienceData, error: experienceError } = await supabase
      .from('experience_items')
      .select('*')
      .eq('user_id', userData.id);

    if (experienceError) {
      console.error('Supabase error fetching experience items:', experienceError);
      return res.status(500).json({ error: 'Failed to fetch experience items', details: experienceError });
    }

    // Combine all data
    const responseData = {
      ...userData,
      socialLinks: socialLinksData || [],
      skills: skillsData || [],
      educationItems: educationData || [],
      experienceItems: experienceData || [],
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Unexpected error in getUser:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}