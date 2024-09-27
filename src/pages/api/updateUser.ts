import { supabase } from '@/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
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
    bodyParser: false,
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

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Failed to parse form data' });
    }

    const { username, profession, fullName, description } = {
      username: Array.isArray(fields.username) ? fields.username[0] : fields.username,
      profession: Array.isArray(fields.profession) ? fields.profession[0] : fields.profession,
      fullName: Array.isArray(fields.fullName) ? fields.fullName[0] : fields.fullName,
      description: Array.isArray(fields.description) ? fields.description[0] : fields.description, 
    };

    // Ensure the username is valid (alphanumeric only, no spaces)
    const validUsername = /^[a-zA-Z0-9]+$/.test(username!);
    if (!validUsername) {
      return res.status(400).json({ error: 'Invalid username. Only alphanumeric characters are allowed.' });
    }

    // Check if the username exists in the database and does not belong to the current user
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('username', username)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking username in Supabase:', checkError);
      return res.status(500).json({ error: 'Error checking username in Supabase' });
    }

    // If a user with this username exists and it's not the current user, return an error
    if (existingUser && existingUser.email !== session.user.email) {
      return res.status(400).json({ error: 'Username already exists. Please choose another.' });
    }

    // Handle image upload (optional)
    let profilePicUrl = null;
    const profilePic = Array.isArray(files.profile_image) ? files.profile_image[0] : files.profile_image;
    if (profilePic && typeof profilePic.filepath === 'string') {
      const cleanedFileName = cleanFileName(profilePic.originalFilename || 'unnamed');
      const filePath = `profile-pics/${session.user.email}_${cleanedFileName}`;
      const blob = bucket.file(filePath);

      try {
        await new Promise((resolve: any, reject) => {
          const blobStream = blob.createWriteStream({ resumable: false });

          blobStream.on('error', (uploadError) => {
            console.error('Image upload error:', uploadError);
            reject(new Error('Failed to upload image'));
          });

          blobStream.on('finish', () => {
            profilePicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve();
          });

          const fileStream = fs.createReadStream(profilePic.filepath);
          fileStream.on('error', (fileError) => {
            reject(new Error('Failed to read file'));
          });

          fileStream.pipe(blobStream);
        });
      } catch (uploadError: any) {
        return res.status(500).json({ error: uploadError.message });
      }
    }

    // Update user data in Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({
        username,
        profession,
        name: fullName,
        description,
        profile_image: profilePicUrl || session.user.profile_image,
      })
      .eq('email', session.user.email);

    if (updateError) {
      console.error('Error updating profile in Supabase:', updateError);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    return res.status(200).json({ message: 'Profile updated successfully' });
  });
}