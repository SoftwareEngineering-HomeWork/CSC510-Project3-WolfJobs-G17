import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../../../src/Pages/Auth/LoginPage';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../../../scr/deprecateded/auth', () => ({
    login: vi.fn(),
}));

describe('LoginPage Component', () => {
    const navigate = useNavigate();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the login form', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));
        
        expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    });

});