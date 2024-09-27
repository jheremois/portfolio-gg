import React from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

type Skill = {
  id: string;
  skill_name: string;
};

type CustomSectionItem = {
  id: string;
  title: string;
  description: string;
};

type CustomSection = {
  id: string;
  section_name: string;
  items: CustomSectionItem[];
};

type UserSectionsProps = {
  userId: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserSections({ userId }: UserSectionsProps) {
  const { data: session } = useSession();
  const { data: skills, error: skillsError } = useSWR<Skill[]>(`/api/skills?userId=${userId}`, fetcher);
  const { data: customSections, error: sectionsError } = useSWR<CustomSection[]>(`/api/customSections?userId=${userId}`, fetcher);

  if (skillsError || sectionsError) return <div>Failed to load user sections</div>;
  if (!skills || !customSections) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-900 text-white">
      {customSections.map((section) => (
        <div key={section.id} className="space-y-4">
          <h2 className="text-2xl font-bold">{section.section_name}</h2>
          {section.items.map((item) => (
            <div key={item.id} className="space-y-1">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      ))}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
            >
              {skill.skill_name}
            </span>
          ))}
        </div>
      </div>

      {session && session.user.id === userId && (
        <div className="col-span-full mt-6">
          <button
            onClick={() => {/* TODO: Implement edit functionality */}}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit Sections
          </button>
        </div>
      )}
    </div>
  );
}