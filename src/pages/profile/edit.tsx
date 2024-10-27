import EditProfile from '@/components/EditProfile';

export default function UpdateUser() {

  return (
      <div className="min-h-screen text-white p-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Update Your Profile</h1>
          <EditProfile />
        </div>
      </div>
  );
}