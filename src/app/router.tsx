import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LandingPage } from '../pages/LandingPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LessonsPage } from '../pages/LessonsPage';
import { LessonPlayerPage } from '../pages/LessonPlayerPage';
import { LabPage } from '../pages/LabPage';
import { ProgressPage } from '../pages/ProgressPage';
import { ParentPage } from '../pages/ParentPage';
import { SafetyPage } from '../pages/SafetyPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { LoginPage } from '../pages/LoginPage';
import { AuthDashboardPage } from '../pages/AuthDashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <LoginPage defaultMode="signup" /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'auth/dashboard',
        element: (
          <ProtectedRoute>
            <AuthDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'learn',
        element: (
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'lessons',
        element: (
          <ProtectedRoute>
            <LessonsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'lessons/:lessonId',
        element: (
          <ProtectedRoute>
            <LessonPlayerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'lab',
        element: (
          <ProtectedRoute>
            <LabPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'progress',
        element: (
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'parent',
        element: (
          <ProtectedRoute>
            <ParentPage />
          </ProtectedRoute>
        ),
      },
      { path: 'safety', element: <SafetyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
