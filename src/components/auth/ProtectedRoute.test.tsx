import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import * as AuthContextModule from '../../context/AuthContext';

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        emailNormalized: 'test@example.com',
        emailVerified: true,
      },
      challenge: null,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      register: vi.fn(),
      loginWithPassword: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      resendOtp: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      resetFlow: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Learning Area</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Learning Area')).toBeInTheDocument();
  });

  it('redirects to /login when unauthenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      challenge: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      register: vi.fn(),
      loginWithPassword: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      resendOtp: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      resetFlow: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/lab']}>
        <Routes>
          <Route
            path="/lab"
            element={
              <ProtectedRoute>
                <div>Protected Lab Activity</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Sign In Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Lab Activity')).not.toBeInTheDocument();
    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
  });
});
