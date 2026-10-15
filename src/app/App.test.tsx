import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
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

const createTestRouter = (initialPath: string) => {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: 'learn', element: <OnboardingPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'lessons', element: <LessonsPage /> },
          { path: 'lessons/:lessonId', element: <LessonPlayerPage /> },
          { path: 'lab', element: <LabPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'parent', element: <ParentPage /> },
          { path: 'safety', element: <SafetyPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] }
  );
};

describe('Route Integration Tests', () => {
  it('renders landing page on /', () => {
    const router = createTestRouter('/');
    render(<RouterProvider router={router} />);
    expect(screen.getAllByRole('button', { name: /Start Learning/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('renders learning band selection on /learn', () => {
    const router = createTestRouter('/learn');
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Which level feels right for you\?/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Detective/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Creator/i)).toBeInTheDocument();
  });

  it('renders child dashboard on /dashboard', () => {
    const router = createTestRouter('/dashboard');
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Learning Path/i)).toBeInTheDocument();
  });

  it('renders lesson library on /lessons', () => {
    const router = createTestRouter('/lessons');
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /Lesson Library/i })).toBeInTheDocument();
    expect(screen.getByText(/What Is AI\?/i)).toBeInTheDocument();
  });

  it('renders lesson player on /lessons/what-is-ai', () => {
    const router = createTestRouter('/lessons/what-is-ai');
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Meet AI: The Pattern Helper!/i)).toBeInTheDocument();
  });

  it('renders AI Lab on /lab', () => {
    const router = createTestRouter('/lab');
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Train a Tiny AI Model/i)).toBeInTheDocument();
    expect(screen.getByText(/STAGE 1/i)).toBeInTheDocument();
  });

  it('renders progress and badges on /progress', () => {
    const router = createTestRouter('/progress');
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Your AI Achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/Badge Shelf/i)).toBeInTheDocument();
  });

  it('renders safety guide on /safety', () => {
    const router = createTestRouter('/safety');
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Safety, Privacy & AI Limitations/i)).toBeInTheDocument();
  });

  it('renders 404 on invalid route', () => {
    const router = createTestRouter('/non-existent-route');
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Lost in the Playground\?/i)).toBeInTheDocument();
  });
});
