import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import RegistrationPage from "../../../src/Pages/Auth/RegistrationPage"; // Update path as needed
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";

// Mock `useNavigate` for testing navigation functionality
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

describe("RegistrationPage Tests", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  // Test Case 1: Render RegistrationPage with required fields
  it("Test Case 1: Renders RegistrationPage with required fields", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skills/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
  });

  // Test Case 2: Render the sign-up button
  it("Test Case 2: Renders the sign-up button", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  // Test Case 3: Navigates to login page when 'Already have an Account? Login Here' is clicked
  it("Test Case 3: Navigates to login page when 'Already have an Account? Login' is clicked", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    const loginText = screen.getByText("Already have an Account? Login");
    fireEvent.click(loginText);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  // Test Case 4: Displays email format validation error for invalid email
  it("Test Case 4: Displays email format validation error for invalid email", async () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email Id/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  // Test Case 5: Renders 'Affiliation' field when 'Manager' role is selected
  it("Test Case 6: Renders 'Affiliation' field when 'Manager' role is selected", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    fireEvent.mouseDown(screen.getByLabelText(/Role/i));
    fireEvent.click(screen.getByText("Manager"));

    expect(screen.getByLabelText(/Affiliation/i)).toBeInTheDocument();
  });
});
