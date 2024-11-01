import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import RegistrationPage from "../../../src/Pages/Auth/RegistrationPage"; // Update path as needed
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { signup } from '../../../src/deprecateded/auth'; // Adjust the import path
import userEvent from '@testing-library/user-event';
vi.mock('../../../src/deprecateded/auth', () => ({
  signup: vi.fn(),
}));

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', () => {
  return {
    ...vi.importActual('react-router-dom'),
    useNavigate: vi.fn(),
  };
});

describe('RegistrationPage Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders all form fields correctly', () => {
    render(<RegistrationPage />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skills/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<RegistrationPage />);

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Confirmation is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Skills is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<RegistrationPage />);

    fireEvent.change(screen.getByLabelText(/Email Id/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('validates password minimum length', async () => {
    render(<RegistrationPage />);

    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("validates that passwords match", async () => {
    render(<RegistrationPage />);

    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: "password456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
    });
  });

  it('shows affiliation field when role is Manager', () => {
    render(<RegistrationPage />);

    // Change role to Manager
    fireEvent.mouseDown(screen.getByLabelText(/Role/i));
    fireEvent.click(screen.getByText(/Manager/i));

    expect(screen.getByLabelText(/Affiliation/i)).toBeInTheDocument();
  });

  it('does not show affiliation field when role is Applicant', () => {
    render(<RegistrationPage />);

    // Ensure role is Applicant
    expect(screen.queryByLabelText(/Affiliation/i)).not.toBeInTheDocument();
  });

  it('calls signup function with correct data for Applicant', async () => {
    render(<RegistrationPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email Id/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Skills/i), {
      target: { value: 'React, Node.js' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'password123',
        'John Doe',
        'Applicant',
        '',
        'React, Node.js',
        mockNavigate
      );
    });
  });

  it('calls signup function with correct data for Manager', async () => {
    render(<RegistrationPage />);

    // Change role to Manager
    fireEvent.mouseDown(screen.getByLabelText(/Role/i));
    fireEvent.click(screen.getByText(/Manager/i));

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Jane Smith' },
    });
    fireEvent.change(screen.getByLabelText(/Email Id/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'securePass1' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'securePass1' },
    });
    fireEvent.change(screen.getByLabelText(/Skills/i), {
      target: { value: 'Leadership, Management' },
    });

    // Change affiliation
    fireEvent.mouseDown(screen.getByLabelText(/Affiliation/i));
    fireEvent.click(screen.getByText(/Campus Enterprises/i));

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(
        'jane@example.com',
        'securePass1',
        'securePass1',
        'Jane Smith',
        'Manager',
        'campus-enterprises',
        'Leadership, Management',
        mockNavigate
      );
    });
  });

  it('navigates to login page when "Already have an Account? Login Here" is clicked', () => {
    render(<RegistrationPage />);

    fireEvent.click(screen.getByText(/Already have an Account\? Login Here/i));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('displays error when skills input exceeds character limit', async () => {
    render(<RegistrationPage />);

    const longSkills = 'A'.repeat(101); // 101 characters

    fireEvent.change(screen.getByLabelText(/Skills/i), {
      target: { value: longSkills },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Skills must be less than 100 characters/i)
      ).toBeInTheDocument();
    });
  });
});