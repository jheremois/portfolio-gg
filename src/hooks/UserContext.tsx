import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
  id: string;
  username: string;
  name: string;
  profession: string;
  description: string;
  profile_image: string;
  education_section_name: string;
  experience_section_name: string;
  socialLinks: Array<{ platform: string; link: string }>;
  skills: Array<{ id: string; skill_name: string }>;
  educationItems: Array<{ id: string; title: string; description: string }>;
  experienceItems: Array<{ id: string; title: string; description: string }>;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refetchUserData: () => Promise<void>;
  updateUserData: (newData: Partial<UserData>) => Promise<void>;
  addSkill: (skillName: string) => Promise<void>;
  removeSkill: (skillId: string) => Promise<void>;
  addEducationItem: (item: { title: string; description: string }) => Promise<void>;
  removeEducationItem: (itemId: string) => Promise<void>;
  addExperienceItem: (item: { title: string; description: string }) => Promise<void>;
  removeExperienceItem: (itemId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const fetchUserData = async () => {
    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/getUser');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data: UserData = await response.json();
        setUserData(data);
        setError(null);
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [status]);

  const refetchUserData = async () => {
    setLoading(true);
    await fetchUserData();
  };

  const updateUserData = async (newData: Partial<UserData>) => {
    if (!userData) return;
    try {
      const response = await fetch('/api/updateUser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error('Failed to update user data');
      setUserData({ ...userData, ...newData });
    } catch (err) {
      console.error('Error updating user data:', err);
      setError('Failed to update user data');
    }
  };

  const addSkill = async (skillName: string) => {
    if (!userData) return;
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_name: skillName }),
      });
      if (!response.ok) throw new Error('Failed to add skill');
      const newSkill = await response.json();
      setUserData({ ...userData, skills: [...userData.skills, newSkill] });
    } catch (err) {
      console.error('Error adding skill:', err);
      setError('Failed to add skill');
    }
  };

  const removeSkill = async (skillId: string) => {
    if (!userData) return;
    try {
      const response = await fetch(`/api/skills/${skillId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove skill');
      setUserData({
        ...userData,
        skills: userData.skills.filter(skill => skill.id !== skillId),
      });
    } catch (err) {
      console.error('Error removing skill:', err);
      setError('Failed to remove skill');
    }
  };

  const addEducationItem = async (item: { title: string; description: string }) => {
    if (!userData) return;
    try {
      const response = await fetch('/api/education-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to add education item');
      const newItem = await response.json();
      setUserData({
        ...userData,
        educationItems: [...userData.educationItems, newItem],
      });
    } catch (err) {
      console.error('Error adding education item:', err);
      setError('Failed to add education item');
    }
  };

  const removeEducationItem = async (itemId: string) => {
    if (!userData) return;
    try {
      const response = await fetch(`/api/education-items/${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove education item');
      setUserData({
        ...userData,
        educationItems: userData.educationItems.filter(item => item.id !== itemId),
      });
    } catch (err) {
      console.error('Error removing education item:', err);
      setError('Failed to remove education item');
    }
  };

  const addExperienceItem = async (item: { title: string; description: string }) => {
    if (!userData) return;
    try {
      const response = await fetch('/api/experience-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to add experience item');
      const newItem = await response.json();
      setUserData({
        ...userData,
        experienceItems: [...userData.experienceItems, newItem],
      });
    } catch (err) {
      console.error('Error adding experience item:', err);
      setError('Failed to add experience item');
    }
  };

  const removeExperienceItem = async (itemId: string) => {
    if (!userData) return;
    try {
      const response = await fetch(`/api/experience-items/${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove experience item');
      setUserData({
        ...userData,
        experienceItems: userData.experienceItems.filter(item => item.id !== itemId),
      });
    } catch (err) {
      console.error('Error removing experience item:', err);
      setError('Failed to remove experience item');
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        error,
        refetchUserData,
        updateUserData,
        addSkill,
        removeSkill,
        addEducationItem,
        removeEducationItem,
        addExperienceItem,
        removeExperienceItem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};