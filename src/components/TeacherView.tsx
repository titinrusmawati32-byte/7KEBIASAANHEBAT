import React from 'react';
import { SchoolInfo, User, Submission, QuizQuestion } from '../types';
import { PortalDashboard } from './PortalDashboard';

interface TeacherViewProps {
  user: User;
  schoolInfo: SchoolInfo;
  users: User[];
  submissions: Submission[];
  quizzes: QuizQuestion[];
  onLogout: () => void;
  onUpdateSubmissions: (subs: Submission[]) => void;
  onUpdateQuizzes: (quizzes: QuizQuestion[]) => void;
  onDeleteSubmission?: (id: string) => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  user,
  schoolInfo,
  users,
  submissions,
  quizzes,
  onLogout,
  onUpdateSubmissions,
  onUpdateQuizzes,
  onDeleteSubmission,
}) => {
  return (
    <PortalDashboard
      currentUser={user}
      schoolInfo={schoolInfo}
      users={users}
      submissions={submissions}
      quizzes={quizzes}
      isDarkMode={document.documentElement.classList.contains('dark')}
      onToggleDarkMode={() => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      }}
      onLogout={onLogout}
      onUpdateSchoolInfo={() => {}}
      onUpdateUsers={() => {}}
      onUpdateSubmissions={onUpdateSubmissions}
      onUpdateQuizzes={onUpdateQuizzes}
      onDeleteSubmission={onDeleteSubmission}
    />
  );
};
