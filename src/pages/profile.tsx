//profile.tsx:
import { useSession, signIn, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to login if not authenticated
    } else if (status === 'authenticated') {
      // Check if user needs to complete profile (e.g., check if profession is missing)
      if (!session?.user?.profession) {
        setIsFirstTime(true); // Show initiation form
      }
    }
  }, [status, session]);



  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profession = formData.get('profession');
    const username = formData.get('username');

    // Call API to update user data
    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profession, username }),
      credentials: 'include',
    });

    if (response.ok) {
      // Refetch the session but don't force re-login
      const updatedSession = await getSession();
      setIsFirstTime(false);
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile.');
    }
  };




  if (status === 'loading') return <div>Loading...</div>;

  if (isFirstTime) {
    return (
      <>
        <div className="text-white">
          <h1>Welcome, {session?.user?.name}!</h1>
          <p>Profession: {session?.user?.profession}</p>
          <form onSubmit={handleProfileUpdate}>
            <label>Username</label>
            <input type="text" name="username" className='text-black' required />
            <label>Profession</label>
            <input type="text" name="profession" className='text-black' required />
            <button type="submit">Complete Profile</button>
          </form>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}!</h1>
      <p>Profession: {session?.user?.profession}</p>
    </div>
  );
};

export default Profile;
