import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create express app for testing
const app = express();
app.use(express.json());
app.use(cors());

// Mock route handler
//This route handler mimics the real route handler
//Any changes to the real handler we need to follow the same changes to this mock handler
app.post('/api/ai', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const message = req.body.text;
    
    if (!message || message.length === 0) {
      return res.status(200).json({ message: '' });
    }

    // Mock AI response
    const mockResponse = `
    Technical Skills:
    1. Proficiency in programming languages such as Javascript, Typescript, Solidity, Java, HTML.
    
    Non-Technical Skills:
    1. Strong leadership and teamwork skills, as demonstrated by taking lead in ideation and development of projects and working as part of a team to improve overall engineer experience.`;

    res.status(200).json({ message: mockResponse });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

describe('AI Resume Parser API Tests', () => {
  // Test 1: Valid resume text
  it('should successfully parse resume text and return skills', async () => {
    const response = await request(app)
      .post('/api/ai')
      .send({ text: 'I am proficient in Python and have excellent communication skills' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.include('Technical Skills');
    expect(response.body.message).to.include('Non-Technical Skills');
  });

  // Test 2: Empty input
  it('should handle empty resume text', async () => {
    const response = await request(app)
      .post('/api/ai')
      .send({ text: '' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('');
  });

  // Test 3: Large input text
  it('should handle large resume text', async () => {
    const largeText = 'A'.repeat(10000); // Create a large string
    const response = await request(app)
      .post('/api/ai')
      .send({ text: largeText });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.include('Technical Skills');
  });

  // Test 4: Invalid request body
  it('should handle invalid request body', async () => {
    const response = await request(app)
      .post('/api/ai')
      .send('{"malformed json');

    expect(response.status).to.equal(200);
  });

  // Test 5: Missing text field
  it('should handle missing text field in request', async () => {
    const response = await request(app)
      .post('/api/ai')
      .send({});

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('');
  });
});