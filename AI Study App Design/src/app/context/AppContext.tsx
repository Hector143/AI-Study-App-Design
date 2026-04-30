import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  avatar: string;
  xp: number;
  streak: number;
  totalQuizzes: number;
  accuracy: number;
}

export interface QuizResult {
  categoryId: string;
  categoryTitle: string;
  score: number;
  total: number;
  date: string;
  timeTaken: number;
}

interface AppContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  quizHistory: QuizResult[];
  addQuizResult: (result: QuizResult) => void;
  activeQuiz: ActiveQuizState | null;
  setActiveQuiz: (quiz: ActiveQuizState | null) => void;
}

export interface ActiveQuizState {
  categoryId: string;
  questionCount: number;
  difficulty: string;
  mode: "multiple-choice" | "true-false" | "mixed";
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([
    {
      categoryId: "science",
      categoryTitle: "General Science",
      score: 8,
      total: 10,
      date: "2026-04-28",
      timeTaken: 120,
    },
    {
      categoryId: "math",
      categoryTitle: "Mathematics",
      score: 7,
      total: 10,
      date: "2026-04-27",
      timeTaken: 145,
    },
    {
      categoryId: "history",
      categoryTitle: "World History",
      score: 9,
      total: 10,
      date: "2026-04-26",
      timeTaken: 98,
    },
  ]);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuizState | null>(null);

  const login = (name: string, email: string) => {
    setUser({
      name,
      email,
      avatar: name[0]?.toUpperCase() || "U",
      xp: 1240,
      streak: 7,
      totalQuizzes: 23,
      accuracy: 82,
    });
  };

  const logout = () => setUser(null);

  const addQuizResult = (result: QuizResult) => {
    setQuizHistory((prev) => [result, ...prev]);
    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              xp: prev.xp + result.score * 10,
              totalQuizzes: prev.totalQuizzes + 1,
              accuracy: Math.round(
                ((prev.accuracy * prev.totalQuizzes + (result.score / result.total) * 100) /
                  (prev.totalQuizzes + 1))
              ),
              streak: prev.streak + 1,
            }
          : null
      );
    }
  };

  return (
    <AppContext.Provider
      value={{ user, login, logout, quizHistory, addQuizResult, activeQuiz, setActiveQuiz }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
