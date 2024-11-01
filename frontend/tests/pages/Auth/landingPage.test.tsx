import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import LandingPage from "../../../src/Pages/Auth/landingPage";
import { MemoryRouter } from "react-router";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

describe("LandingPage - Tests", () => {
  const mockedUseNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockedUseNavigate);
  });

  it("renders LandingPage", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    // Basic render test; can be expanded if needed
  });

  it("renders LandingPage with essential elements", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText((content, element) => {
        return (
          element.textContent ===
          "We understand that being a student can be challenging."
        );
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Login/i })
    ).toBeInTheDocument();
  });

  it("navigates to '/register' when 'Sign Up' button is clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    fireEvent.click(signUpButton);

    expect(mockedUseNavigate).toHaveBeenCalledWith("/register");
  });

  it("navigates to '/login' when 'Login' button is clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(mockedUseNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders 'Sign Up' button with correct styling", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveStyle({
      background: "#FF5353",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "223px",
      height: "54px",
      position: "absolute",
      left: "62px",
      top: "501px",
    });
  });

  it("renders 'Login' button with correct styling", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveStyle({
      background: "#FFFFFF",
      border: "1px solid #656565",
      borderRadius: "10px",
      boxSizing: "border-box",
      width: "223px",
      height: "54px",
      position: "absolute",
      left: "359px",
      top: "501px",
    });
  });

  it("renders images correctly", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute(
      "src",
      "/images/landingpage_image1.png"
    );
    expect(images[1]).toHaveAttribute(
      "src",
      "/images/landingpage_image2.png"
    );
  });
});
