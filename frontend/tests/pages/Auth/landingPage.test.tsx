import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import LoginPage from "../../../src/Pages/Auth/LoginPage";
import { MemoryRouter } from "react-router";
import axios from "axios";
import { vi } from "vitest";
import { login } from "../../../src/deprecateded/auth";

vi.mock("axios");
vi.mock("../../../src/deprecateded/auth", () => ({
  login: vi.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedLogin = login as jest.Mock;

describe("LoginPage - Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.post = vi.fn();
  });

  it("renders LoginPage with essential elements", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText("Sign In to your Account")).toBeInTheDocument();
  });

  it("shows email validation error when empty", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Login"));
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("shows password validation error when empty", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Login"));
    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows email format error when email is invalid", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email Id/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Email format is not valid")).toBeInTheDocument();
    });
  });

  it("accepts a valid email format", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email Id/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(
        screen.queryByText("Email format is not valid")
      ).not.toBeInTheDocument();
    });
  });

  it("accepts input in the password field", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordField = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordField, { target: { value: "password123" } });
    expect(passwordField).toHaveValue("password123");
  });

  it("renders login button with correct styling", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveStyle({
      background: "#FF5353",
      borderRadius: "10px",
      textTransform: "none",
      fontSize: "16px",
    });
  });
});