// TEST FILE:
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import ProfileEdit from "../../../src/Pages/Profile/ProfileEdit";

describe("ProfileEdit Component", () => {
  it("renders ProfileEdit without crashing", () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={{}} />
      </MemoryRouter>
    );
  });

  // New Test Case 1: Renders the 'Save Profile' button
  it("renders the 'Save Profile' button", () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={{}} />
      </MemoryRouter>
    );
    const buttonElement = screen.getByText(/Save Profile/i);
    expect(buttonElement).toBeInTheDocument();
  });

  // New Test Case 2: Renders the 'Name' input field
  it("renders the 'Name' input field", () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={{}} />
      </MemoryRouter>
    );
    const nameInput = screen.getByLabelText(/Name/i);
    expect(nameInput).toBeInTheDocument();
  });

  // New Test Case 3: Renders the 'Email' input field as disabled
  it("renders the 'Email' input field as disabled", () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={{ email: "test@example.com" }} />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toBeDisabled();
  });

  // New Test Case 4: Renders the 'Role' input field as disabled
  it("renders the 'Role' input field as disabled", () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={{ role: "User" }} />
      </MemoryRouter>
    );
    const roleInput = screen.getByLabelText(/Role/i);
    expect(roleInput).toBeInTheDocument();
    expect(roleInput).toBeDisabled();
  });

  // New Test Case 5: Form renders without validation errors initially
  it("renders form without validation errors initially", () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={{}} />
      </MemoryRouter>
    );
    const errorMessages = screen.queryAllByText(/is required/i);
    expect(errorMessages.length).toBe(0);
  });
});
