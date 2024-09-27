import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { supabase } from '@/supabaseClient';
import { Storage } from '@google-cloud/storage';
import formidable from 'formidable';
import fs from 'fs';

const gcpKey = JSON.parse(process.env.GCP_KEY || '{}');
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: gcpKey,
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME || "");

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

// Function to clean filename
function cleanFileName(fileName: string): string {
  return fileName
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-_.]/g, '')  // Remove any character that's not alphanumeric, hyphen, underscore, or dot
    .toLowerCase();              // Convert to lowercase
}

export default async function handler(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .maybeSingle();

  if (userError || !userData) {
    console.error('Error fetching user:', userError);
    return res.status(500).json({ error: 'Failed to retrieve user data' });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Failed to parse form data' });
    }

    const { portfolio_name, color, description, link } = {
      portfolio_name: Array.isArray(fields.portfolio_name) ? fields.portfolio_name[0] : fields.portfolio_name,
      color: Array.isArray(fields.color) ? fields.color[0] : fields.color,
      description: Array.isArray(fields.description) ? fields.description[0] : fields.description,
      link: Array.isArray(fields.link) ? fields.link[0] : fields.link,
    };

    const user_id = userData.id;

    if (!portfolio_name || !color || !description || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let image_url = null;

    const imageFile = files.image;
    if (imageFile && Array.isArray(imageFile)) {
      const file = imageFile[0];
      const cleanedFileName = cleanFileName(file.originalFilename || 'unnamed');
      const filePath = `portfolio-images/${session.user.email}_${cleanedFileName}`;
      const blob = bucket.file(filePath);

      try {
        await new Promise((resolve: any, reject) => {
          const blobStream = blob.createWriteStream({ resumable: false });

          blobStream.on('error', (uploadError) => {
            console.error('Image upload error:', uploadError);
            reject(new Error('Failed to upload image'));
          });

          blobStream.on('finish', () => {
            image_url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve();
          });

          const fileStream = fs.createReadStream(file.filepath);
          fileStream.on('error', (fileError) => {
            reject(new Error('Failed to read file'));
          });

          fileStream.pipe(blobStream);
        });
      } catch (uploadError: any) {
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        user_id,
        portfolio_name,
        image_url,
        color,
        description,
        link,
      });

    if (error) {
      console.error('Error inserting portfolio item:', error);
      return res.status(500).json({ error: 'Failed to create portfolio item' });
    }

    return res.status(200).json({ message: 'Portfolio item created successfully', portfolio_item: data });
  });
}