import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import * as AuthContextModule from '../context/AuthContext';

describe('LoginPage Component', () => {
  const mockRegister = vi.fn();
  const mockLoginWithPassword = vi.fn();
  const mockSendOtp = vi.fn();
  const mockVerifyOtp = vi.fn();
  const mockResendOtp = vi.fn();
  const mockResetFlow = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      challenge: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      register: mockRegister,
      loginWithPassword: mockLoginWithPassword,
      sendOtp: mockSendOtp,
      verifyOtp: mockVerifyOtp,
      resendOtp: mockResendOtp,
      logout: vi.fn(),
      clearError: mockClearError,
      resetFlow: mockResetFlow,
    });
  });

  it('renders in Sign In mode by default with Password and OTP options', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    expect(screen.getByTestId('password-login-submit')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your account password/i)).toBeInTheDocument();
  });

  it('renders in Create Account mode when mode=signup is in query params with name, phone, email and password', () => {
    render(
      <MemoryRouter initialEntries={['/login?mode=signup']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Create Parent Account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Sarah Jenkins/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. \+1 555-0192 or 9876543210/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/parent@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/At least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Parent Account/i })).toBeInTheDocument();
  });

  it('submits parent registration with full name, phone, email, and password', async () => {
    mockRegister.mockResolvedValueOnce({
      success: true,
      message: 'Account created',
    });

    render(
      <MemoryRouter initialEntries={['/login?mode=signup']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Sarah Jenkins/i), {
      target: { value: 'Sarah Connor' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. \+1 555-0192 or 9876543210/i), {
      target: { value: '+1 555-1234' },
    });
    fireEvent.change(screen.getByPlaceholderText(/parent@example\.com/i), {
      target: { value: 'sarah@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/At least 6 characters/i), {
      target: { value: 'securePass123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Re-enter password/i), {
      target: { value: 'securePass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Parent Account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Sarah Connor',
        phone: '+1 555-1234',
        email: 'sarah@example.com',
        password: 'securePass123',
      });
    });
  });

  it('submits password login with email and password', async () => {
    mockLoginWithPassword.mockResolvedValueOnce({
      success: true,
      message: 'Welcome back!',
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'sarah@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your account password/i), {
      target: { value: 'securePass123' },
    });

    fireEvent.click(screen.getByTestId('password-login-submit'));

    await waitFor(() => {
      expect(mockLoginWithPassword).toHaveBeenCalledWith('sarah@example.com', 'securePass123');
    });
  });

  it('allows switching to Email & OTP Code login method', async () => {
    mockSendOtp.mockResolvedValueOnce({
      success: true,
      message: 'Code sent',
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Switch to Email & OTP Code
    fireEvent.click(screen.getByRole('button', { name: /Email & OTP Code/i }));

    expect(screen.getByRole('button', { name: /Send 6-Digit Code/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'parent@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send 6-Digit Code/i }));

    await waitFor(() => {
      expect(mockSendOtp).toHaveBeenCalledWith('parent@example.com', 'login');
    });
  });

  it('shows No Account Found and suggests Create Account when login fails with USER_NOT_FOUND', async () => {
    mockLoginWithPassword.mockResolvedValueOnce({
      success: false,
      message: 'No account found with this email. Please create an account first.',
      code: 'USER_NOT_FOUND',
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your account password/i), {
      target: { value: 'somePassword123' },
    });

    fireEvent.click(screen.getByTestId('password-login-submit'));

    await waitFor(() => {
      expect(screen.getByText(/No Account Found/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Account with this Email/i })).toBeInTheDocument();
    });

    // Clicking "Create Account with this Email" switches mode to Create Account
    fireEvent.click(screen.getByRole('button', { name: /Create Account with this Email/i }));

    expect(screen.getByRole('heading', { name: /Create Parent Account/i })).toBeInTheDocument();
  });
});
