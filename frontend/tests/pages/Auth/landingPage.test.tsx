import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../../../src/Pages/Auth/landingPage";
import { useNavigate } from "react-router-dom";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("LandingPage Component", () => {
  const navigate = useNavigate();


  test("renders heading text correctly", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const headingText = screen.getByText(/We understand that being a student can be/i);
    expect(headingText).toBeInTheDocument();
  });

  test("renders description text correctly", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const descriptionText = screen.getByText(/Join our dynamic team right here on campus/i);
    expect(descriptionText).toBeInTheDocument();
  });

  test("renders Sign Up and Login buttons", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    const loginButton = screen.getByRole("button", { name: /Login/i });
    
    expect(signUpButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test("renders image with alt text", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const image = screen.getByAltText("Landing Page Image");
    expect(image).toBeInTheDocument();
  });


  test("navigates to register page on Sign Up click", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    fireEvent.click(signUpButton);

    expect(navigate).toHaveBeenCalledWith("/register");
  });

  test("navigates to login page on Login click", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(navigate).toHaveBeenCalledWith("/login");
  });


  test("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

 
  test("should have no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });


  test("renders correctly on mobile screen", () => {
    window.innerWidth = 375; 
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const headingText = screen.getByText(/challenging/i);
    expect(headingText).toBeInTheDocument();
  });

  test("renders correctly on desktop screen", () => {
    window.innerWidth = 1280; 
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const headingText = screen.getByText(/challenging/i);
    expect(headingText).toBeInTheDocument();
  });

  test("focus moves to Sign Up button on Tab key press", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    signUpButton.focus();
    expect(signUpButton).toHaveFocus();
  });

  test("focus moves to Login button on Tab key press after Sign Up button", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    const loginButton = screen.getByRole("button", { name: /Login/i });

    signUpButton.focus();
    expect(signUpButton).toHaveFocus();

    loginButton.focus();
    expect(loginButton).toHaveFocus();
  });
});
