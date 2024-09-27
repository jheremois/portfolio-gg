import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import EditProfile from '@/components/EditProfile';
import Link from 'next/link';
import Project from '@/components/Project';

// Definimos las interfaces para nuestros nuevos tipos de datos
interface Skill {
  id: string;
  skill_name: string;
}

interface SectionItem {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function Profile() {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    profession: '',
    description: '',
    profile_image: ''
  });
  const [portfolioItems, setPortfolioItems] = useState([]);

  // Nuevos estados para habilidades y secciones
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experienceItems, setExperienceItems] = useState<SectionItem[]>([]);
  const [educationItems, setEducationItems] = useState<SectionItem[]>([]);
  const [experienceSectionName, setExperienceSectionName] = useState('Experience');
  const [educationSectionName, setEducationSectionName] = useState('Education');

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/getPortfolioItems');
      const data = await response.json();

      if (response.ok) {
        setPortfolioItems(data.portfolioItems);
      } else {
        toast.error(data.error || 'Failed to fetch portfolio items');
      }
    } catch (error) {
      toast.error('An error occurred while fetching portfolio items.');
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user) {
      fetchProfileData();
      fetchPortfolioItems();
      fetchSkills();
      fetchExperienceItems();
      fetchEducationItems();
    }
  }, [status, session, router]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/getUser');
      const data = await response.json();

      if (response.ok) {
        setProfileData({
          username: data.username,
          fullName: data.name,
          profession: data.profession,
          description: data.description || '',
          profile_image: data.profile_image || '',
        });
        setIsEditing(!data.profession); // Set editing mode if profession is not set
      } else {
        toast.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('An error occurred while loading profile data.');
    }
  };

  const handleLogout = async () => {
    signOut({ callbackUrl: '/' });
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    fetchProfileData();
  };

  // Nuevas funciones para manejar habilidades y secciones
  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      const data = await response.json();
      if (response.ok) {
        setSkills(data);
      } else {
        toast.error('Failed to load skills');
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('An error occurred while loading skills.');
    }
  };

  const fetchExperienceItems = async () => {
    try {
      const response = await fetch('/api/experience-items');
      const data = await response.json();
      if (response.ok) {
        setExperienceItems(data.items);
        setExperienceSectionName(data.sectionName);
      } else {
        toast.error('Failed to load experience items');
      }
    } catch (error) {
      console.error('Error fetching experience items:', error);
      toast.error('An error occurred while loading experience items.');
    }
  };

  const fetchEducationItems = async () => {
    try {
      const response = await fetch('/api/education-items');
      const data = await response.json();
      if (response.ok) {
        setEducationItems(data.items);
        setEducationSectionName(data.sectionName);
      } else {
        toast.error('Failed to load education items');
      }
    } catch (error) {
      console.error('Error fetching education items:', error);
      toast.error('An error occurred while loading education items.');
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-text container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isEditing ? (
        <>
          <header className='text-center mb-7'>
            <h1 className='font-semibold text-title text-2xl sm:text-3xl mb-2'>
              {profileData.profession ? 'Edit Your Profile' : 'Welcome! First things first'}
            </h1>
            <p className='text-text'>
              {profileData.profession ? 'Update your portfolio information below.' : 'Let\'s create your portfolio, we can start here...'}
            </p>
          </header>
          <EditProfile funcion={handleEditComplete} />
        </>
      ) : (
        <div className="">
          <section className='pt-6'>
            <div>
              <h1 className='font-semibold text-title text-2xl sm:text-3xl mb-6'>Your Profile</h1>
              <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 lg:items-center">
                {/* Profile info */}
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:col-span-9">
                  <img src={profileData.profile_image} alt={profileData.fullName} className="w-full h-auto lg:w-[19rem] lg:h-[19rem] 2xl:w-[21rem] 2xl:h-[21rem] rounded-3xl object-cover" />
                  <div className="text-center sm:text-left">
                    <h3 className='text-4xl sm:text-3xl lg:text-4xl font-semibold'>
                      {profileData.fullName}
                    </h3>
                    <p className='text-blue-600 font-semibold text-xl sm:text-xl mt-2 lg:mt-1 mb-2.5'>
                      {profileData.profession}
                    </p>
                    <p className="text-base sm:text-lg text-text">{profileData.description}</p>
                    {/* <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <Link href={"profile/edit"}>
                        <button
                          className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition duration-300"
                        >
                          Edit Profile
                        </button>
                      </Link>
                      <button
                        className="w-full sm:w-auto bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition duration-300"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div> */}
                  </div>
                </div>
                {/* Social media and contact */}
                <div className="lg:col-span-3 text-title">
                  <div className="w-full lg:max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg overflow-hidden lg:p-4">
                    <h2 className="text-xl font-medium  hidden lg:flex">Contact</h2>
                    <div className="flex flex-col gap-8 lg:flex-row justify-between items-center mb-4">
                      <div className="flex space-x-4 w-full justify-around lg:w-fit mt-8 mb-2">
                        <Link href={""} className="w-8 h-8 lg:w-6 lg:h-6">
                          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </Link>
                        <Link href={""} className="w-8 h-8 lg:w-6 lg:h-6">
                          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </Link>
                        <Link href={""} className="w-8 h-8 lg:w-6 lg:h-6">
                          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </Link>
                        <Link href={""} className="w-8 h-8 lg:w-6 lg:h-6">
                          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </Link>
                      </div>
                      <button className="px-4 py-3 border-2 border-gray-200/30 rounded-xl text-base w-full lg:w-fit">
                        Share
                      </button>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className='border-t-[3px] border-gray-400/10 my-8' />

          <section className='grid lg:grid-cols-3 divide-x divide-gray-50/5 gap-2 bg-[#f0f0f002] text-text lg:py-5 lg:px-2 border-2 border-gray-200/20 rounded-3xl'>
            {/* Nueva sección de experiencia */}
            <section className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-2xl font-semibold'>{experienceSectionName}</h3>
              </div>
              <div className="flex flex-col gap-3">
                {experienceItems.map((item) => (
                  <div key={item.id} className='rounded'>
                    <h3 className='text-lg font-medium'>{item.title}</h3>
                    <p className='text-gray-200/70'>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
            {/* Nueva sección de educación */}
            <section className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-semibold'>{educationSectionName}</h2>
              </div>
              <div className="flex flex-col gap-3">
                {educationItems.map((item) => (
                  <div key={item.id} className='rounded'>
                    <h3 className='text-lg font-medium'>{item.title}</h3>
                    <p className='text-gray-200/70'>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
            {/* Nueva sección de habilidades */}
            <section className='p-6'>
              <h2 className='text-2xl font-semibold mb-4'>Skills</h2>
              <div className='flex flex-wrap gap-3 gap-y-4'>
                {skills.map((skill) => (
                  <div key={skill.id} className='bg-blue-800/10 ring-2 ring-blue-100/30 text-text px-3 py-1 rounded-full flex items-center'>
                    <span>{skill.skill_name}</span>
                  </div>
                ))}
              </div>
            </section>
          </section>


          {/* Seccion de proyectos */}
          <hr className='border-t-[3px] border-gray-400/10 my-8' />
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h4 className='fadeIn text-3xl md:text-2xl font-semibold text-center md:text-start'>
                Projects
              </h4>
              <div className="">
                <Link href={"/profile/projects"}>
                  <button className='bg-secondary border-2 border-gray-300/20 py-3 px-6 rounded-2xl text-title font-semibold'>
                    Add project
                  </button>
                </Link>
              </div>
            </div>
            <div className="projectList grid md:grid-cols-3 gap-7">
              {portfolioItems.map((item: any) => (
                <Project
                  key={item.id}
                  imgBg={item.image_url || ''}  // Assuming your API provides image_url
                  title={item.portfolio_name}
                  description={item.description || ''}
                  bgColor={item.color || '#000'}  // Assuming there's a color field
                  projectUrl={item.link || '#'}  // Assuming project link
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}