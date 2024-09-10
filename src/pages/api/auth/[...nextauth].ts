import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/supabaseClient';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: any) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('profession')
        .eq('email', session.user.email)
        .single();

      if (error) {
        console.error('Error fetching user profession:', error);
      }

      session.user.profession = userData?.profession || null; // Add profession to session
      return session;
    },

    async signIn({ user, account }: any) {
      const { email, name, image }: any = user;
      const google_id = account?.providerAccountId || null;

      console.log('User information from Google:', { email, name, image, google_id });

      try {
        // Check if user already exists in the database
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .maybeSingle(); // Use maybeSingle to avoid throwing an error if no rows are returned

        if (checkError) {
          console.error('Error checking user in Supabase:', checkError);
          return false; // Fail sign-in if there's a check error
        }

        if (!existingUser) {
          // User does not exist, proceed with insertion
          console.log('User does not exist, inserting into Supabase...');
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              email,
              google_id,
              username: email.split('@')[0], // Customize username as needed
              name,
              profile_image: image,
            });

          if (insertError) {
            console.error('Error inserting user into Supabase:', insertError.message);
            return false; // Fail sign-in if there's an error inserting the user
          } else {
            console.log('User inserted successfully into Supabase');
          }
        } else {
          console.log('User already exists, skipping insertion.');
        }

        return true; // Proceed with login if successful
      } catch (error) {
        console.error('Sign-in error:', error);
        return false; // Return false to indicate failure
      }
    },
  },
};

export default NextAuth(authOptions);
