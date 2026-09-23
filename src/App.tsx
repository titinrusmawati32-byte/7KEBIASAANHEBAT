/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, SchoolInfo, Submission, QuizQuestion, Habit } from './types';
import { storage } from './utils/storage';
import { LoginView } from './components/LoginView';
import { AdminView } from './components/AdminView';
import { TeacherView } from './components/TeacherView';
import { StudentView } from './components/StudentView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(storage.getSchoolInfo());
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [submissions, setSubmissions] = useState<Submission[]>(storage.getSubmissions());
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(storage.getQuizzes());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load session on mount
  useEffect(() => {
    const savedUser = storage.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
  };

  const handleUpdateSchoolInfo = (info: SchoolInfo) => {
    setSchoolInfo(info);
    storage.saveSchoolInfo(info);
  };

  const handleUpdateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    storage.saveUsers(newUsers);
  };

  const handleUpdateSubmissions = (newSubs: Submission[]) => {
    setSubmissions(newSubs);
    storage.saveSubmissions(newSubs);
  };

  const handleDeleteSubmission = (subId: string) => {
    const subToDelete = submissions.find((s) => s.id === subId);
    if (!subToDelete) return;

    const updatedSubs = submissions.filter((s) => s.id !== subId);
    setSubmissions(updatedSubs);
    storage.saveSubmissions(updatedSubs);

    // If deleted sub belongs to current user or student, adjust points
    const targetStudent = users.find((u) => u.id === subToDelete.studentId);
    if (targetStudent && subToDelete.pointsEarned) {
      const updatedUser = {
        ...targetStudent,
        points: Math.max(0, targetStudent.points - subToDelete.pointsEarned),
      };

      if (currentUser?.id === targetStudent.id) {
        setCurrentUser(updatedUser);
        storage.setCurrentUser(updatedUser);
      }

      const updatedUsersList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      setUsers(updatedUsersList);
      storage.saveUsers(updatedUsersList);
    }
  };

  const handleUpdateQuizzes = (newQuizzes: QuizQuestion[]) => {
    setQuizzes(newQuizzes);
    storage.saveQuizzes(newQuizzes);
  };

  // Student habit completion handler
  const handleSubmitHabit = (
    habitId: Habit['id'],
    note: string,
    photoUrl: string,
    quizAnsweredCorrectly: boolean
  ) => {
    if (!currentUser) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];

    const bonusPoints = quizAnsweredCorrectly ? 20 : 10;

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      class: currentUser.class,
      date: todayStr,
      habitId,
      completedAt: nowTime,
      note,
      photoUrl,
      pointsEarned: bonusPoints,
      teacherVerified: true,
    };

    // Update submissions list
    const updatedSubmissions = [newSub, ...submissions];
    setSubmissions(updatedSubmissions);
    storage.saveSubmissions(updatedSubmissions);

    // Update user points
    const updatedUser = {
      ...currentUser,
      points: currentUser.points + bonusPoints,
    };
    setCurrentUser(updatedUser);
    storage.setCurrentUser(updatedUser);

    const updatedUsersList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsersList);
    storage.saveUsers(updatedUsersList);
  };

  return (
    <div className="min-h-screen bg-bright-yellow-blue text-slate-900 selection:bg-yellow-300">
      {/* Floating View Switcher Bar (For testing & immediate review between all 4 uploaded screens) */}
      <div className="bg-slate-900 text-white text-xs font-bold py-2 px-4 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-extrabold text-yellow-300 font-heading text-sm">
            Portal 7 Kebiasaan Anak Indonesia Hebat
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            {schoolInfo.schoolName}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-slate-800 text-yellow-300 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1 mr-1"
          >
            {isDarkMode ? '🌙 Mode Gelap' : '☀️ Mode Terang'}
          </button>

          <span className="text-[10px] uppercase text-slate-400 font-bold mr-1">Switch Menu:</span>
          <button
            onClick={() => handleLogout()}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
              !currentUser ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            1. Login
          </button>
          <button
            onClick={() => handleLogin(users.find((u) => u.role === 'admin') || users[6])}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
              currentUser?.role === 'admin' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            2. Admin (Kepsek)
          </button>
          <button
            onClick={() => handleLogin(users.find((u) => u.role === 'guru') || users[4])}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
              currentUser?.role === 'guru' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            3. Guru
          </button>
          <button
            onClick={() => handleLogin(users.find((u) => u.role === 'siswa') || users[0])}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
              currentUser?.role === 'siswa' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            4. Siswa
          </button>
        </div>
      </div>

      {/* Screen Views */}
      {!currentUser && (
        <LoginView
          schoolInfo={schoolInfo}
          users={users}
          onLogin={handleLogin}
        />
      )}

      {currentUser?.role === 'admin' && (
        <AdminView
          user={currentUser}
          schoolInfo={schoolInfo}
          users={users}
          submissions={submissions}
          onLogout={handleLogout}
          onUpdateSchoolInfo={handleUpdateSchoolInfo}
          onUpdateUsers={handleUpdateUsers}
          onUpdateSubmissions={handleUpdateSubmissions}
          onDeleteSubmission={handleDeleteSubmission}
        />
      )}

      {currentUser?.role === 'guru' && (
        <TeacherView
          user={currentUser}
          schoolInfo={schoolInfo}
          users={users}
          submissions={submissions}
          quizzes={quizzes}
          onLogout={handleLogout}
          onUpdateSubmissions={handleUpdateSubmissions}
          onUpdateQuizzes={handleUpdateQuizzes}
          onDeleteSubmission={handleDeleteSubmission}
        />
      )}

      {currentUser?.role === 'siswa' && (
        <StudentView
          user={currentUser}
          submissions={submissions}
          quizzes={quizzes}
          onLogout={handleLogout}
          onSubmitHabit={handleSubmitHabit}
          onDeleteSubmission={handleDeleteSubmission}
        />
      )}
    </div>
  );
}
