import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid username parameter' });
  }

  try {
    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id, 
        username, 
        name, 
        profession, 
        description, 
        profile_image, 
        experience_section_name, 
        education_section_name,
        skills_section_name,
        projects_section_name,
        formspark
      `)
      .eq('username', username)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch social links
    const { data: socialLinks, error: socialLinksError } = await supabase
      .from('social_links')
      .select('platform, link')
      .eq('user_id', userData.id);

    if (socialLinksError) {
      console.error('Error fetching social links:', socialLinksError);
    }

    // Fetch portfolio items
    const { data: portfolioItems, error: portfolioError } = await supabase
      .from('portfolio_items')
      .select('id, portfolio_name, description, image_url, color, link')
      .eq('user_id', userData.id);

    if (portfolioError) {
      console.error('Error fetching portfolio items:', portfolioError);
    }

    // Fetch skills
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('id, skill_name')
      .eq('user_id', userData.id);

    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
    }

    // Fetch experience items
    const { data: experienceItems, error: experienceError } = await supabase
      .from('experience_items')
      .select('id, title, description, created_at')
      .eq('user_id', userData.id);

    if (experienceError) {
      console.error('Error fetching experience items:', experienceError);
    }

    // Fetch education items
    const { data: educationItems, error: educationError } = await supabase
      .from('education_items')
      .select('id, title, description, created_at')
      .eq('user_id', userData.id);

    if (educationError) {
      console.error('Error fetching education items:', educationError);
    }

    // Combine all data
    const profileData = {
      ...userData,
      socialLinks: socialLinks || [],
      portfolioItems: portfolioItems || [],
      skills: skills || [],
      experienceItems: experienceItems || [],
      educationItems: educationItems || [],
    };  

    return res.status(200).json(profileData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}