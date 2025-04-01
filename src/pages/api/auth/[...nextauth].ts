import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/supabaseClient';

// Función para generar un username a partir del correo
const generateUsername = (email: string): string => {
  const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${base}${randomSuffix}`;
};

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
      try {
        const { email, name, image }: any = user;
        const google_id = account?.providerAccountId || null;

        if (!email) {
          console.error('❌ Missing user email in Google data.');
          return false;
        }

        console.log('🔐 SignIn attempt:', { email, name, google_id });

        // Buscar si el usuario ya existe en Supabase
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (checkError) {
          console.error('❌ Supabase SELECT error:', checkError.message);
          return false;
        }

        // Si no existe, se genera un username y se inserta el usuario
        if (!existingUser) {
          console.log('🆕 Usuario no encontrado, insertando...');

          const username = generateUsername(email);

          const { error: insertError } = await supabase.from('users').insert({
            email,
            google_id,
            username, // Generamos un username único
            name,
            profile_image: image || '',
            experience_section_name: 'Experience',
            education_section_name: 'Education',
          });

          if (insertError) {
            console.error('❌ Error al insertar usuario:', insertError.message);
            return false;
          }

          console.log('✅ Usuario insertado correctamente en Supabase.');
        } else {
          console.log('✔️ Usuario ya existe en Supabase.');
        }

        return true;
      } catch (error: any) {
        console.error('🔥 Error inesperado en signIn callback:', error.message || error);
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
