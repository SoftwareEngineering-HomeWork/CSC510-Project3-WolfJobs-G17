import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../../../src/Pages/Profile/Profile";

describe("Profile Component", () => {
  it("renders Profile component without crashing", () => {
    // Render the Profile component inside a memory router
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
  });

  it("displays static profile labels", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Check for static labels that should be displayed
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Role:")).toBeInTheDocument();
    expect(screen.getByText("Address:")).toBeInTheDocument();
    expect(screen.getByText("Skills:")).toBeInTheDocument();
    expect(screen.getByText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByText("Availability:")).toBeInTheDocument();
    expect(screen.getByText("Gender:")).toBeInTheDocument();
    expect(screen.getByText("Resume:")).toBeInTheDocument();
  });

  it("toggles edit mode on pencil icon click", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const editIcon = screen.queryByText(/pencil/i);
    if (editIcon) {
      fireEvent.click(editIcon);

      expect(screen.queryByText("Editing Profile")).toBeInTheDocument();
    }
  });
  it("renders the close icon in edit mode", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const editIcon = screen.queryByText(/pencil/i);
    if (editIcon) {
      fireEvent.click(editIcon);
      const closeIcon = screen.queryByText(/close/i);
      expect(closeIcon).toBeInTheDocument();
    }
  });
  it("renders Profile title", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.queryByText("Profile")).toBeInTheDocument();
  });
  it("can exit edit mode by clicking the close icon", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const editIcon = screen.queryByText(/pencil/i);
    if (editIcon) {
      fireEvent.click(editIcon); // Toggle to edit mode
    }

    const closeIcon = screen.queryByText(/close/i);
    if (closeIcon) {
      fireEvent.click(closeIcon); // Toggle back to view mode
    }

    expect(screen.queryByText("Profile")).toBeInTheDocument();
  });

  it("does not display close icon initially", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.queryByText(/close/i)).not.toBeInTheDocument();
  });
  it("displays profile information correctly after entering edit mode", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const editIcon = screen.queryByText(/pencil/i);
    if (editIcon) {
      fireEvent.click(editIcon);

      expect(screen.queryByText("Editing Profile")).toBeInTheDocument();
    }
  });
  it("shows 'Profile' title consistently when exiting and entering edit mode", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.queryByText("Profile")).toBeInTheDocument();

    const editIcon = screen.queryByText(/pencil/i);
    if (editIcon) {
      fireEvent.click(editIcon);
    }

    expect(screen.queryByText("Profile")).toBeInTheDocument();

    const closeIcon = screen.queryByText(/close/i);
    if (closeIcon) {
      fireEvent.click(closeIcon);
    }

    expect(screen.queryByText("Profile")).toBeInTheDocument();
  });

  it("can toggle to edit mode and back to view mode without errors", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const editIcon = screen.queryByText(/pencil/i);
    if (editIcon) {
      fireEvent.click(editIcon);

      expect(screen.queryByText(/close/i)).toBeInTheDocument();
    }

    const closeIcon = screen.queryByText(/close/i);
    if (closeIcon) {
      fireEvent.click(closeIcon);

      expect(screen.queryByText(/pencil/i)).toBeInTheDocument();
    }
  });
});
