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

    it('renders job links correctly', async () => {
        const liveJobsData = {
            departments: ['Engineering'],
            links: ['http://example.com/job1'],
            positions: ['Software Engineer'],
        };
        (axios.get as jest.Mock).mockResolvedValue({ data: liveJobsData });
        
        render(<LiveJobsView />);
        
        await waitFor(() => {
            const applyLink = screen.getByText(/Apply Here/i);
            expect(applyLink.closest('a')).toHaveAttribute('href', 'http://example.com/job1');
        });
    });

    it('renders no jobs message when no data is available', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: { departments: [], links: [], positions: [] } });
        
        render(<LiveJobsView />);
        
        await waitFor(() => {
            expect(screen.getByText(/No live jobs available/i)).toBeInTheDocument();
        });
    });

    it('renders job links correctly', async () => {
        const liveJobsData = {
            departments: ['Engineering'],
            links: ['http://example.com/job1'],
            positions: ['Software Engineer'],
        };
        (axios.get as jest.Mock).mockResolvedValue({ data: liveJobsData });
        
        render(<LiveJobsView />);
        
        await waitFor(() => {
            // Find the link directly using getByText
            const applyLink = screen.getByText(/Apply Here/i);
            expect(applyLink).toHaveAttribute('href', 'http://example.com/job1');
        });
    });

    it('shows loading state while fetching data', async () => {
        (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {})); // Simulate a pending request
        render(<LiveJobsView />);
        
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('does not crash on invalid data', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: null }); // Simulate invalid data
        render(<LiveJobsView />);
        
        await waitFor(() => {
            expect(screen.getByText(/Loading.../i)).toBeInTheDocument(); // Ensure it still shows loading
        });
    });

    it('renders correct number of job listings', async () => {
        const liveJobsData = {
            departments: ['Engineering', 'Marketing'],
            links: ['http://example.com/job1', 'http://example.com/job2'],
            positions: ['Software Engineer', 'Marketing Manager'],
        };
        (axios.get as jest.Mock).mockResolvedValue({ data: liveJobsData });
        
        render(<LiveJobsView />);
        
        await waitFor(() => {
            const jobListings = screen.getAllByText(/Apply Here/i);
            expect(jobListings.length).toBe(2); // Ensure the correct number of job listings
        });
    });
});