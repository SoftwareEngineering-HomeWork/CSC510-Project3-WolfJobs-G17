import { render, screen } from "@testing-library/react";
import React from "react";
import LogoutPage from "../../../src/Pages/Auth/LogoutPage";
import { MemoryRouter } from "react-router";
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import * as userStore from '../../../src/store/UserStore';

vi.mock('react-router-dom', () => {
  return {
    ...vi.importActual('react-router-dom'),
    useNavigate: vi.fn(),
  };
});

// Mock localStorage.clear()
const localStorageClearMock = vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {});

// Mock console.log
const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('LogoutPage Component', () => {
  it('should clear localStorage, reset user store, and navigate to login page', () => {
    // Mock the update functions from useUserStore
    const updateName = vi.fn();
    const updateAddress = vi.fn();
    const updateRole = vi.fn();
    const updateDob = vi.fn();
    const updateSkills = vi.fn();
    const updatePhonenumber = vi.fn();
    const updateId = vi.fn();
    const updateAvailability = vi.fn();
    const updateGender = vi.fn();
    const updateHours = vi.fn();
    const updateIsLoggedIn = vi.fn();

    const userStoreMock = {
      updateName,
      updateAddress,
      updateRole,
      updateDob,
      updateSkills,
      updatePhonenumber,
      updateId,
      updateAvailability,
      updateGender,
      updateHours,
      updateIsLoggedIn,
    };

    // Mock useUserStore using vi.spyOn
    vi.spyOn(userStore, 'useUserStore').mockImplementation((selector) =>
      selector(userStoreMock)
    );

    // Mock useNavigate
    const navigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigate);

    // Render the component
    render(<LogoutPage />);

    // Verify that localStorage.clear() was called
    expect(localStorageClearMock).toHaveBeenCalled();

    // Verify that update functions are called with expected arguments
    expect(updateName).toHaveBeenCalledWith('');
    expect(updateAddress).toHaveBeenCalledWith('');
    expect(updateRole).toHaveBeenCalledWith('');
    expect(updateDob).toHaveBeenCalledWith('');
    expect(updateSkills).toHaveBeenCalledWith('');
    expect(updatePhonenumber).toHaveBeenCalledWith('');
    expect(updateId).toHaveBeenCalledWith('');
    expect(updateAvailability).toHaveBeenCalledWith('');
    expect(updateGender).toHaveBeenCalledWith('');
    expect(updateHours).toHaveBeenCalledWith('');
    expect(updateIsLoggedIn).toHaveBeenCalledWith(false);

    // Verify that navigate('/login') was called
    expect(navigate).toHaveBeenCalledWith('/login');

    // Verify that console.log('Logged out') was called
    expect(consoleLogMock).toHaveBeenCalledWith('Logged out');

    // Clean up mocks
    localStorageClearMock.mockRestore();
    consoleLogMock.mockRestore();
  });
});
