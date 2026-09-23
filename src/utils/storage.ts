import { SchoolInfo, User, Submission, QuizQuestion } from '../types';
import { INITIAL_SCHOOL_INFO, INITIAL_USERS, INITIAL_SUBMISSIONS, INITIAL_QUIZZES } from '../data/initialData';

const KEYS = {
  SCHOOL: '7kebiasaan_school_info',
  USERS: '7kebiasaan_users',
  SUBMISSIONS: '7kebiasaan_submissions',
  QUIZZES: '7kebiasaan_quizzes',
  CURRENT_USER: '7kebiasaan_current_user',
};

export const storage = {
  getSchoolInfo(): SchoolInfo {
    try {
      const data = localStorage.getItem(KEYS.SCHOOL);
      return data ? JSON.parse(data) : INITIAL_SCHOOL_INFO;
    } catch {
      return INITIAL_SCHOOL_INFO;
    }
  },

  saveSchoolInfo(info: SchoolInfo): void {
    try {
      localStorage.setItem(KEYS.SCHOOL, JSON.stringify(info));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getUsers(): User[] {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  updateUser(updatedUser: User): void {
    const users = this.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    this.saveUsers(users);
  },

  deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);
  },

  getSubmissions(): Submission[] {
    try {
      const data = localStorage.getItem(KEYS.SUBMISSIONS);
      return data ? JSON.parse(data) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  saveSubmissions(subs: Submission[]): void {
    try {
      localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(subs));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  addSubmission(sub: Submission): void {
    const subs = this.getSubmissions();
    subs.unshift(sub); // add newest first
    this.saveSubmissions(subs);
  },

  getQuizzes(): QuizQuestion[] {
    try {
      const data = localStorage.getItem(KEYS.QUIZZES);
      return data ? JSON.parse(data) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  },

  saveQuizzes(quizzes: QuizQuestion[]): void {
    try {
      localStorage.setItem(KEYS.QUIZZES, JSON.stringify(quizzes));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  addQuiz(quiz: QuizQuestion): void {
    const quizzes = this.getQuizzes();
    quizzes.push(quiz);
    this.saveQuizzes(quizzes);
  },

  deleteQuiz(quizId: string): void {
    const quizzes = this.getQuizzes().filter(q => q.id !== quizId);
    this.saveQuizzes(quizzes);
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  resetAll(): void {
    try {
      localStorage.removeItem(KEYS.SCHOOL);
      localStorage.removeItem(KEYS.USERS);
      localStorage.removeItem(KEYS.SUBMISSIONS);
      localStorage.removeItem(KEYS.QUIZZES);
      localStorage.removeItem(KEYS.CURRENT_USER);
    } catch (e) {
      console.warn('Storage reset error:', e);
    }
  }
};
