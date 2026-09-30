/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, SchoolInfo, Submission, QuizQuestion, Habit } from './types';
import { storage } from './utils/storage';
import { firestoreStorage } from './utils/firestoreStorage';
import { LoginView } from './components/LoginView';
import { AdminView } from './components/AdminView';
import { TeacherView } from './components/TeacherView';
import { StudentView } from './components/StudentView';
import { PortalDashboard } from './components/PortalDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(storage.getSchoolInfo());
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [submissions, setSubmissions] = useState<Submission[]>(storage.getSubmissions());
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(storage.getQuizzes());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Attach Firestore real-time subscriptions
  useEffect(() => {
    const unsubSchool = firestoreStorage.subscribeSchoolInfo((info) => {
      setSchoolInfo(info);
      storage.saveSchoolInfo(info);
    });

    const unsubUsers = firestoreStorage.subscribeUsers((updatedUsers) => {
      setUsers(updatedUsers);
      storage.saveUsers(updatedUsers);
      // Keep currentUser state in sync if user points/details change
      if (currentUser) {
        const freshUser = updatedUsers.find((u) => u.id === currentUser.id);
        if (freshUser) {
          setCurrentUser(freshUser);
          storage.setCurrentUser(freshUser);
        }
      }
    });

    const unsubSubs = firestoreStorage.subscribeSubmissions((subs) => {
      setSubmissions(subs);
      storage.saveSubmissions(subs);
    });

    const unsubQuizzes = firestoreStorage.subscribeQuizzes((qList) => {
      setQuizzes(qList);
      storage.saveQuizzes(qList);
    });

    return () => {
      unsubSchool();
      unsubUsers();
      unsubSubs();
      unsubQuizzes();
    };
  }, []);

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
    firestoreStorage.saveSchoolInfo(info);
  };

  const handleUpdateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    storage.saveUsers(newUsers);
    firestoreStorage.saveUsers(newUsers);
  };

  const handleUpdateSubmissions = (newSubs: Submission[]) => {
    setSubmissions(newSubs);
    storage.saveSubmissions(newSubs);
    if (newSubs.length === 0) {
      firestoreStorage.clearAllSubmissions();
    } else {
      firestoreStorage.saveSubmissions(newSubs);
    }
  };

  const handleDeleteSubmission = (subId: string) => {
    const subToDelete = submissions.find((s) => s.id === subId);
    if (!subToDelete) return;

    const updatedSubs = submissions.filter((s) => s.id !== subId);
    setSubmissions(updatedSubs);
    storage.saveSubmissions(updatedSubs);
    firestoreStorage.deleteSubmission(subId);

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
      firestoreStorage.saveUser(updatedUser);
    }
  };

  const handleUpdateQuizzes = (newQuizzes: QuizQuestion[]) => {
    setQuizzes(newQuizzes);
    storage.saveQuizzes(newQuizzes);
    firestoreStorage.saveQuizzes(newQuizzes);
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
    firestoreStorage.addSubmission(newSub);

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
    firestoreStorage.saveUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Sleek Minimalist Quick View Switcher Bar for App Testing */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4 flex items-center justify-between border-b border-slate-800 gap-2 sticky top-0 z-50 shadow-sm no-print overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="hidden sm:inline font-semibold text-slate-200 text-xs">
            Portal 7 Kebiasaan Anak Indonesia Hebat
          </span>
          <span className="sm:hidden font-bold text-slate-200 text-xs">
            Demo Portal
          </span>
          <span className="hidden md:inline text-[10px] text-slate-400 border-l border-slate-700 pl-2">
            {schoolInfo.schoolName}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 text-xs shrink-0">
          <span className="hidden sm:inline text-[10px] uppercase text-slate-400 font-semibold mr-0.5">Peran:</span>
          <button
            onClick={() => handleLogout()}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              !currentUser ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleLogin(users.find((u) => u.role === 'admin') || users[6])}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              currentUser?.role === 'admin' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => handleLogin(users.find((u) => u.role === 'guru') || users[4])}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              currentUser?.role === 'guru' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Guru
          </button>
          <button
            onClick={() => handleLogin(users.find((u) => u.role === 'siswa') || users[0])}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              currentUser?.role === 'siswa' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Siswa
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

      {(currentUser?.role === 'admin' || currentUser?.role === 'guru') && (
        <PortalDashboard
          currentUser={currentUser}
          schoolInfo={schoolInfo}
          users={users}
          submissions={submissions}
          quizzes={quizzes}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onLogout={handleLogout}
          onUpdateSchoolInfo={handleUpdateSchoolInfo}
          onUpdateUsers={handleUpdateUsers}
          onUpdateSubmissions={handleUpdateSubmissions}
          onUpdateQuizzes={handleUpdateQuizzes}
          onDeleteSubmission={handleDeleteSubmission}
        />
      )}

      {currentUser?.role === 'siswa' && (
        <StudentView
          user={currentUser}
          schoolInfo={schoolInfo}
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
