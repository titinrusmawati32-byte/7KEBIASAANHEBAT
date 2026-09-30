import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SchoolInfo, User, Submission, QuizQuestion } from '../types';
import {
  INITIAL_SCHOOL_INFO,
  INITIAL_USERS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
} from '../data/initialData';

// Collection Names
const COLLECTIONS = {
  SCHOOL: 'school_info',
  USERS: 'users',
  SUBMISSIONS: 'submissions',
  QUIZZES: 'quizzes',
};

export const firestoreStorage = {
  // Real-time listener for School Info
  subscribeSchoolInfo(onUpdate: (info: SchoolInfo) => void) {
    try {
      const docRef = doc(db, COLLECTIONS.SCHOOL, 'default');
      return onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            onUpdate(snapshot.data() as SchoolInfo);
          } else {
            // Seed initial school info if empty
            this.saveSchoolInfo(INITIAL_SCHOOL_INFO);
            onUpdate(INITIAL_SCHOOL_INFO);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, COLLECTIONS.SCHOOL);
        }
      );
    } catch (e) {
      console.warn('Firestore subscribeSchoolInfo error:', e);
      return () => {};
    }
  },

  async saveSchoolInfo(info: SchoolInfo) {
    try {
      const docRef = doc(db, COLLECTIONS.SCHOOL, 'default');
      await setDoc(docRef, info);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.SCHOOL);
    }
  },

  // Real-time listener for Users
  subscribeUsers(onUpdate: (users: User[]) => void) {
    try {
      const colRef = collection(db, COLLECTIONS.USERS);
      return onSnapshot(
        colRef,
        async (snapshot) => {
          if (snapshot.empty) {
            // Seed initial users if database is empty
            for (const user of INITIAL_USERS) {
              await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
            }
            onUpdate(INITIAL_USERS);
          } else {
            const usersList = snapshot.docs.map((docSnap) => docSnap.data() as User);
            onUpdate(usersList);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.USERS);
        }
      );
    } catch (e) {
      console.warn('Firestore subscribeUsers error:', e);
      return () => {};
    }
  },

  async saveUsers(users: User[]) {
    try {
      for (const user of users) {
        await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.USERS);
    }
  },

  async saveUser(user: User) {
    try {
      await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.USERS);
    }
  },

  async deleteUser(userId: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, COLLECTIONS.USERS);
    }
  },

  // Real-time listener for Submissions
  subscribeSubmissions(onUpdate: (subs: Submission[]) => void) {
    try {
      const colRef = collection(db, COLLECTIONS.SUBMISSIONS);
      return onSnapshot(
        colRef,
        async (snapshot) => {
          if (snapshot.empty) {
            // Seed initial submissions if empty
            for (const sub of INITIAL_SUBMISSIONS) {
              await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, sub.id), sub);
            }
            onUpdate(INITIAL_SUBMISSIONS);
          } else {
            const subsList = snapshot.docs.map(
              (docSnap) => docSnap.data() as Submission
            );
            // Sort by completedAt or date descending
            subsList.sort((a, b) => b.id.localeCompare(a.id));
            onUpdate(subsList);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.SUBMISSIONS);
        }
      );
    } catch (e) {
      console.warn('Firestore subscribeSubmissions error:', e);
      return () => {};
    }
  },

  async addSubmission(sub: Submission) {
    try {
      await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, sub.id), sub);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.SUBMISSIONS);
    }
  },

  async saveSubmissions(subs: Submission[]) {
    try {
      for (const sub of subs) {
        await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, sub.id), sub);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.SUBMISSIONS);
    }
  },

  async deleteSubmission(submissionId: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SUBMISSIONS, submissionId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, COLLECTIONS.SUBMISSIONS);
    }
  },

  async clearAllSubmissions() {
    try {
      const colRef = collection(db, COLLECTIONS.SUBMISSIONS);
      const snapshot = await getDocs(colRef);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(docSnap.ref);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, COLLECTIONS.SUBMISSIONS);
    }
  },

  // Real-time listener for Quizzes
  subscribeQuizzes(onUpdate: (quizzes: QuizQuestion[]) => void) {
    try {
      const colRef = collection(db, COLLECTIONS.QUIZZES);
      return onSnapshot(
        colRef,
        async (snapshot) => {
          if (snapshot.empty) {
            // Seed initial quizzes if empty
            for (const quiz of INITIAL_QUIZZES) {
              await setDoc(doc(db, COLLECTIONS.QUIZZES, quiz.id), quiz);
            }
            onUpdate(INITIAL_QUIZZES);
          } else {
            const quizList = snapshot.docs.map(
              (docSnap) => docSnap.data() as QuizQuestion
            );
            onUpdate(quizList);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.QUIZZES);
        }
      );
    } catch (e) {
      console.warn('Firestore subscribeQuizzes error:', e);
      return () => {};
    }
  },

  async saveQuizzes(quizzes: QuizQuestion[]) {
    try {
      for (const quiz of quizzes) {
        await setDoc(doc(db, COLLECTIONS.QUIZZES, quiz.id), quiz);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.QUIZZES);
    }
  },

  async addQuiz(quiz: QuizQuestion) {
    try {
      await setDoc(doc(db, COLLECTIONS.QUIZZES, quiz.id), quiz);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.QUIZZES);
    }
  },

  async deleteQuiz(quizId: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.QUIZZES, quizId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, COLLECTIONS.QUIZZES);
    }
  },
};
