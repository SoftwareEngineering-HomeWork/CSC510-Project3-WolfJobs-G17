import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, beforeAll, afterAll, beforeEach, expect, vi } from 'vitest';
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import PDFTextExtractor from "../../../src/components/Resume/PDFTextExtractor";

// Mock external dependencies
vi.mock('axios');
vi.mock('react-pdf');

// Mock console.error to avoid cluttering test output
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Mock PDF.js functionality
const mockGetTextContent = vi.fn().mockResolvedValue({
  items: [
    { str: 'Technical Skills:' },
    { str: '1. Programming Languages: Python, JavaScript' },
    { str: '2. Frameworks: React, Node.js' },
    { str: '3. Tools: Git, Docker' },
    { str: 'Non-Technical Skills:' },
    { str: '1. Strong communication skills' },
    { str: '2. Team leadership' },
  ]
});

const mockGetPage = vi.fn().mockResolvedValue({
  getTextContent: mockGetTextContent
});

// Update the mock PDF document structure
const mockPdfDocument = {
  numPages: 1,
  getPage: mockGetPage,
  promise: undefined as any
};
mockPdfDocument.promise = Promise.resolve(mockPdfDocument);

describe('PDFTextExtractor', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock axios GET request for resume
    (axios.get as any).mockResolvedValue({
      data: new Blob(['dummy pdf content'], { type: 'application/pdf' }),
    });

    // Update the PDF.js document loading mock
    (pdfjs.getDocument as any).mockReturnValue(mockPdfDocument);

    // Mock fetch for AI endpoint
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        message: `Technical Skills:
1. Programming Languages: Python, JavaScript
2. Frameworks: React, Node.js
3. Tools: Git, Docker
Non-Technical Skills:
1. Strong communication skills
2. Team leadership`
      })
    }) as any;

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/resume/123/456']}>
        <Routes>
          <Route path="/resume/:applicantId/:_id" element={<PDFTextExtractor />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should fetch resume and make API calls on mount', async () => {
    renderComponent();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8000/users/applicantresume/123',
        { responseType: 'blob' }
      );
    });
  });

  it('should display parsed skills from resume', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Technical Skills')).toBeDefined();
    });

    // Verify technical skills section
    expect(screen.getByText('Programming Languages')).toBeDefined();
    expect(screen.getByText('Python')).toBeDefined();
    expect(screen.getByText('JavaScript')).toBeDefined();
    expect(screen.getByText('Frameworks')).toBeDefined();
    expect(screen.getByText('Tools')).toBeDefined();

    // Verify non-technical skills section
    expect(screen.getByText('Non-Technical Skills')).toBeDefined();
    expect(screen.getByText('Strong communication skills')).toBeDefined();
    expect(screen.getByText('Team leadership')).toBeDefined();
  });

  it('should handle resume fetch error', async () => {
    (axios.get as any).mockRejectedValueOnce(new Error('Failed to fetch resume'));
    // Keep the PDF mock consistent
    (pdfjs.getDocument as any).mockReturnValue(mockPdfDocument);
    renderComponent();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching resume',
        expect.any(Error)
      );
    });
  });

  it('should handle AI API error', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('AI API failed'));
    // Keep the PDF mock consistent
    (pdfjs.getDocument as any).mockReturnValue(mockPdfDocument);
    renderComponent();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error sending text to backend:',
        expect.any(Error)
      );
    });
  });
});