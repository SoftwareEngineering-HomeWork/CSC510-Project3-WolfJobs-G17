import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import LiveJobsView from '../../../src/components/Job/LiveJobsView';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('axios');

describe('LiveJobsView Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(<LiveJobsView />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('renders error message on fetch failure', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('Error fetching live jobs'));
        render(<LiveJobsView />);
        
        await waitFor(() => {
            expect(screen.getByText(/Error fetching live jobs/i)).toBeInTheDocument();
        });
    });

    it('renders live jobs when data is fetched successfully', async () => {
        const liveJobsData = {
            departments: ['Engineering', 'Marketing'],
            links: ['http://example.com/job1', 'http://example.com/job2'],
            positions: ['Software Engineer', 'Marketing Manager'],
        };
        (axios.get as jest.Mock).mockResolvedValue({ data: liveJobsData });
        
        render(<LiveJobsView />);
        
        await waitFor(() => {
            expect(screen.getByText(/Live Jobs/i)).toBeInTheDocument();
            expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
            expect(screen.getByText(/Marketing Manager/i)).toBeInTheDocument();
        });
    });

    it('renders correct department for each job', async () => {
        const liveJobsData = {
            departments: ['Engineering', 'Marketing'],
            links: ['http://example.com/job1', 'http://example.com/job2'],
            positions: ['Software Engineer', 'Marketing Manager'],
        };
        (axios.get as jest.Mock).mockResolvedValue({ data: liveJobsData });
        
        render(<LiveJobsView />);
        
        await waitFor(() => {
            expect(screen.getByText(/Department: Engineering/i)).toBeInTheDocument();
            expect(screen.getByText(/Department: Marketing/i)).toBeInTheDocument();
        });
    });

    it('renders apply links correctly', async () => {
        const liveJobsData = {
            departments: ['Engineering', 'Marketing'],
            links: ['http://example.com/job1', 'http://example.com/job2'],
            positions: ['Software Engineer', 'Marketing Manager'],
        };
        (axios.get as jest.Mock).mockResolvedValue({ data: liveJobsData });
        
        render(<LiveJobsView />);
        
        await waitFor(() => {
            const applyLinks = screen.getAllByText(/Apply Here/i);
            expect(applyLinks.length).toBe(2);
            expect(applyLinks[0].closest('a')).toHaveAttribute('href', 'http://example.com/job1');
            expect(applyLinks[1].closest('a')).toHaveAttribute('href', 'http://example.com/job2');
        });
    });
});