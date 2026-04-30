import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import QuizSetup from "./pages/QuizSetup";
import QuizActive from "./pages/QuizActive";
import QuizResults from "./pages/QuizResults";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/quiz/:categoryId",
    Component: QuizSetup,
  },
  {
    path: "/quiz/:categoryId/play",
    Component: QuizActive,
  },
  {
    path: "/quiz/:categoryId/results",
    Component: QuizResults,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
