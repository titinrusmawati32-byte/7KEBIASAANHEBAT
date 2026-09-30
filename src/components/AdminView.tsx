import React from 'react';
import { SchoolInfo, User, Submission } from '../types';
import { PortalDashboard } from './PortalDashboard';

interface AdminViewProps {
  user: User;
  schoolInfo: SchoolInfo;
  users: User[];
  submissions: Submission[];
  onLogout: () => void;
  onUpdateSchoolInfo: (info: SchoolInfo) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateSubmissions: (subs: Submission[]) => void;
  onDeleteSubmission?: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  schoolInfo,
  users,
  submissions,
  onLogout,
  onUpdateSchoolInfo,
  onUpdateUsers,
  onUpdateSubmissions,
  onDeleteSubmission,
}) => {
  return (
    <PortalDashboard
      currentUser={user}
      schoolInfo={schoolInfo}
      users={users}
      submissions={submissions}
      quizzes={[]}
      isDarkMode={document.documentElement.classList.contains('dark')}
      onToggleDarkMode={() => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      }}
      onLogout={onLogout}
      onUpdateSchoolInfo={onUpdateSchoolInfo}
      onUpdateUsers={onUpdateUsers}
      onUpdateSubmissions={onUpdateSubmissions}
      onUpdateQuizzes={() => {}}
      onDeleteSubmission={onDeleteSubmission}
    />
  );
};
