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
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile.sub;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        
        session.user.id = token.id;
        session.user.email = token.email;
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('profession, username, experience_section_name, education_section_name')
          .eq('email', session.user.email)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          session.user.profession = userData?.profession || null;
          session.user.username = userData?.username || null;
          session.user.experience_section_name = userData?.experience_section_name || 'Experience';
          session.user.education_section_name = userData?.education_section_name || 'Education';
        }
      }
      return session;
    },
    async signIn({ user, account }: any) {
      const { email, name, image }: any = user;
      const google_id = account?.providerAccountId || null;

      console.log('User information from Google:', { email, name, image, google_id });

      try {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking user in Supabase:', checkError);
          return false;
        }

        if (!existingUser) {
          console.log('User does not exist, inserting into Supabase...');
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              email,
              google_id,
              username: "",
              name,
              profile_image: image,
              experience_section_name: 'Experience',
              education_section_name: 'Education',
            });

          if (insertError) {
            console.error('Error inserting user into Supabase:', insertError.message);
            return false;
          } else {
            console.log('User inserted successfully into Supabase');
          }
        } else {
          console.log('User already exists, skipping insertion.');
        }

        return true;
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);