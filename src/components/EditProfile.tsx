'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric')
        .required('Username is required'),
    fullName: Yup.string().required('Full name is required'),
    profession: Yup.string().required('Profession is required'),
    description: Yup.string(),
});

interface EditProfileProps {
    funcion?: () => void;
}

export default function EditProfile({ funcion }: EditProfileProps) {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        username: '',
        fullName: '',
        profession: '',
        description: '',
        profile_image: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (status === 'authenticated' && session?.user) {
            fetchProfileData();
        }
    }, [status, session, router]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/getUser');
            const data = await response.json();

            if (response.ok) {
                setProfileData({
                    username: data.username || '',
                    fullName: data.name || '',
                    profession: data.profession || '',
                    description: data.description || '',
                    profile_image: data.profile_image || '',
                });
            } else {
                toast.error('Failed to load profile data');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('An error occurred while loading profile data.');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setFieldValue('profile_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('profession', values.profession);
        formData.append('fullName', values.fullName);
        formData.append('description', values.description);
        if (imageFile) {
            formData.append('profile_image', imageFile);
        }

        try {
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Profile updated successfully');
                if (funcion) {
                    funcion();
                }
                router.push('/profile');
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred while updating the profile.');
        } finally {
            setSubmitting(false);
        }
    };

    if (status === 'loading') {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="text-text">
            <div className="max-w-4xl mx-auto">
                <Formik
                    enableReinitialize
                    initialValues={profileData}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="space-y-6">
                            <div className="flex flex-col lg:flex-row text-center lg:text-start items-center lg:gap-8">
                                <div className="flex w-full lg:w-fit">
                                    <div className="w-full h-auto lg:w-64 lg:h-64 mx-auto bg-gray-700 rounded-lg overflow-hidden mb-4">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            profileData.profile_image && (
                                                <img src={profileData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-start h-full lg:h-auto justify-center w-full lg:w-fit">
                                    <label
                                        htmlFor="profile_image"
                                        className="
                                            cursor-pointer mb-2 bg-input border-2 rounded-lg border-gray-300/20 text-text py-3
                                            px-10 mx-auto lg:mx-0 w-full lg:w-fit mt-2
                                        "
                                    >
                                        Upload new photo
                                        <input
                                            id="profile_image"
                                            name="profile_image"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e, setFieldValue)}
                                            accept="image/*"
                                        />
                                    </label>
                                    <p className="text-sm text-gray-400 mt-2">At least 800x800 px recommended. JPG or PNG allowed.</p>
                                </div>
                            </div>
                            <hr className='border-gray-300/20 border-t-[2.5px]' />
                            <div className="space-y-8 lg:space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium mb-2">Username (unique, no spaces or special characters)</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border-2 border-r-0 border-gray-300/20 bg-gray-950/20 text-gray-100 sm:text-sm">www.portfoliogg.com/</span>
                                        <Field
                                            type="text"
                                            id="username"
                                            name="username"
                                            className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <ErrorMessage name="username" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div className="flex flex-col lg:flex-row w-full gap-4">
                                    <div className='w-full'>
                                        <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
                                        <Field
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            className="block w-full px-3 py-3 rounded-md bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        <ErrorMessage name="fullName" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div className='w-full'>
                                        <label htmlFor="profession" className="block text-sm font-medium mb-2">Profession</label>
                                        <Field
                                            type="text"
                                            id="profession"
                                            name="profession"
                                            className="block w-full px-3 py-3 rounded-md bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        <ErrorMessage name="profession" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                                    <Field
                                        as="textarea"
                                        id="description"
                                        name="description"
                                        className="block w-full px-3 py-3 rounded-md bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full bg-blue-600 text-text py-3.5 px-4 text-lg rounded-md hover:bg-blue-700 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Profile'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}