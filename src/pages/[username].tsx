import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Project from '@/components/Project';
import ShareModal from '@/components/Sharemodal';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ContactModal from '@/components/ContactButton';

interface ClientSideWrapperProps {
    children: React.ReactNode;
    profileData: any;
}

function ClientSideWrapper({ children, profileData }: ClientSideWrapperProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (profileData) {
            setIsLoading(false);
        }
    }, [profileData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-background text-text container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {children}
        </motion.div>
    );
}

interface ProfileData {
    experience_section_name: string;
    education_section_name: string;
    skills_section_name: string;
    projects_section_name: string;
}
interface ProfileData {
    id: string;
    username: string;
    name: string;
    profession: string;
    description: string;
    profile_image: string;
    experience_section_name: string;
    education_section_name: string;
    skills_section_name: string;
    projects_section_name: string;
    socialLinks: { platform: string; link: string }[];
    portfolioItems: {
        id: string;
        portfolio_name: string;
        description: string;
        image_url: string;
        color: string;
        link: string;
    }[];
    skills: { id: string; skill_name: string }[];
    experienceItems: {
        id: string;
        title: string;
        description: string;
        created_at: string;
    }[];
    educationItems: {
        id: string;
        title: string;
        description: string;
        created_at: string;
    }[];
    formspark: string;
}

interface PublicProfileProps {
    profileData: ProfileData;
}

export default function PublicProfile({ profileData }: PublicProfileProps) {
    const pageTitle = `${profileData.name} - ${profileData.profession} | Portfoliogg`;
    const pageDescription = `Check out ${profileData.name}'s professional portfolio. ${profileData.description}`;
    const canonicalUrl = `https://www.portfoliogg.com/${profileData.username}`;

    return (
        <ClientSideWrapper profileData={profileData}>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="profile" />
                <meta property="og:image" content={profileData.profile_image} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={profileData.profile_image} />
            </Head>

            <section className='pt-6'>
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 lg:items-center">
                        <motion.div
                            className="flex flex-col lg:flex-row items-center gap-6 lg:col-span-9"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src={profileData.profile_image}
                                alt={profileData.name}
                                width={336}
                                height={336}
                                className="w-full h-auto border-4 border-border lg:w-[19rem] lg:h-[19rem] 2xl:w-[21rem] 2xl:h-[21rem] rounded-3xl object-cover"
                            />
                            <div className="text-center sm:text-left">
                                <h1 className='text-4xl sm:text-3xl lg:text-4xl font-semibold'>
                                    {profileData.name}
                                </h1>
                                <p className='text-blue-600 font-semibold text-xl sm:text-xl mt-2 lg:mt-1 mb-2.5'>
                                    {profileData.profession}
                                </p>
                                <p className="text-base sm:text-lg text-text">{profileData.description}</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="lg:col-span-3 text-title"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="w-full lg:max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg overflow-hidden lg:p-4">
                                <h2 className="text-xl font-medium hidden lg:flex">Contact</h2>
                                <div className="flex flex-col flex-wrap gap-8 lg:flex-row justify-between items-center mb-4">
                                    <div className="flex space-x-4 w-full justify-around lg:w-fit mt-8">
                                        {profileData.socialLinks.map((link, i) => (
                                            <Link href={link.link} target='_blank' className="w-8 h-8 lg:w-6 lg:h-6" key={i}>
                                                {getSocialIcon(link.platform)}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="w-full">
                                        <ShareModal username={profileData.username} />
                                        {profileData.formspark && (
                                            <div className="mt-4">
                                                <ContactModal username={profileData.username} formsparkId={profileData.formspark} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <motion.section
                className='grid lg:grid-cols-3 my-11 border-2 border-border gap-2 text-text lg:py-5 lg:px-2 rounded-3xl lg:divide-x-[2.3px] lg:divide-y-0 divide-y-2 divide-gray-100/10'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <section className='px-6 py-12 lg:py-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className='text-2xl font-semibold'>{profileData.experience_section_name}</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        {profileData.experienceItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className='rounded'
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            >
                                <h3 className='text-lg font-medium'>{item.title}</h3>
                                <p className='text-gray-200/70'>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
                <section className='px-6 py-12 lg:py-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-2xl font-semibold'>{profileData.education_section_name}</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {profileData.educationItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className='rounded'
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                            >
                                <h3 className='text-lg font-medium'>{item.title}</h3>
                                <p className='text-gray-200/70'>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
                <section className='px-6 py-12 lg:py-6'>
                    <h2 className='text-2xl font-semibold mb-4'>{profileData.skills_section_name || 'Skills'}</h2>
                    <div className='flex flex-wrap gap-3 gap-y-4'>
                        {profileData.skills.map((skill, index) => (
                            <motion.div
                                key={skill.id}
                                className='bg-card ring-2 ring-border text-text px-3 py-1 rounded-full flex items-center'
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 1.2 + index * 0.05 }}
                            >
                                <span>{skill.skill_name}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </motion.section>

            <motion.div
                className="grid gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
            >
                <div className="flex items-center justify-between">
                    <h4 className='fadeIn text-3xl md:text-2xl font-semibold text-center md:text-start'>
                        {profileData.projects_section_name || 'Projects'}
                    </h4>
                </div>
                <div className="projectList grid md:grid-cols-3 gap-7">
                    {profileData.portfolioItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                        >
                            <Project
                                imgBg={item.image_url || ''}
                                title={item.portfolio_name}
                                description={item.description || ''}
                                bgColor={item.color || '#000'}
                                projectUrl={item.link || '#'}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </ClientSideWrapper>
    );
}

function getSocialIcon(platform: string) {
    switch (platform) {
        case "LinkedIn":
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            );
        case "Facebook":
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            );
        case "Instagram":
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            );
        case "X":
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
            );
        case "Website":
            return (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            );
        default:
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
            );
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { username } = context.params as { username: string };
    const res = await fetch(`https://www.portfoliogg.com/api/profiles/${username}`);
    const profileData = await res.json();

    if (!profileData || profileData.error) {
        return {
            notFound: true,
        };
    }

    /* console.log('Profile Data:', profileData); */

    return {
        props: { profileData },
    };
};