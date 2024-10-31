import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import LoginPage from "../../../src/Pages/Auth/LoginPage";
import { MemoryRouter } from "react-router";
import axios from "axios";
import { vi } from "vitest";
import { login } from "../../../src/deprecateded/auth";

// Mock axios and login requests
vi.mock("axios");
vi.mock("../../../src/deprecateded/auth", () => ({
  login: vi.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedLogin = login as jest.Mock;

describe("LoginPage - Test Casesyy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.post = vi.fn();
  });

  // Test 1: Renders the LoginPage component
  it("renders LoginPage with essential elements", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});