const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../routes/auth.js'); // Your Express app
const AuthOtp = require('../models/authOtp');
const User = require('../models/user');
const nodemailer = require('nodemailer');

// Mock nodemailer
jest.mock('nodemailer');

// Add this mock implementation
nodemailer.createTransport.mockReturnValue({
  verify: jest.fn().mockImplementation((callback) => callback(null, true)),
  sendMail: jest.fn().mockResolvedValue(true)
});

describe('OTP Authentication Tests', () => {
  let testUser;
  
  beforeAll(async () => {
    // Create a test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await AuthOtp.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear OTPs before each test
    await AuthOtp.deleteMany({});
  });

  describe('Generate OTP', () => {
    it('should generate and send OTP successfully', async () => {
      // Mock email sending
      const mockSendMail = jest.fn().mockResolvedValue(true);
      nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

      const response = await request(app)
        .post('/api/auth/generate-otp')
        .send({
          email: testUser.email,
          userId: testUser._id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent successfully');

      // Verify OTP was created in database
      const otp = await AuthOtp.findOne({ userId: testUser._id });
      expect(otp).toBeTruthy();
      expect(otp.otp).toHaveLength(6);

      // Verify email was sent
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/generate-otp')
        .send({
          email: 'invalid@email.com',
          userId: testUser._id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Verify OTP', () => {
    it('should verify valid OTP successfully', async () => {
      // Create an OTP
      const otp = '123456';
      await AuthOtp.create({
        userId: testUser._id,
        otp
      });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: testUser.email,
          otp
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP verified successfully');

      // Verify OTP was deleted after successful verification
      const otpInDb = await AuthOtp.findOne({ userId: testUser._id });
      expect(otpInDb).toBeNull();
    });

    it('should fail with invalid OTP', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: testUser.email,
          otp: '999999'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired OTP');
    });

    it('should fail with expired OTP', async () => {
      // Create an expired OTP (11 minutes old)
      const otp = '123456';
      await AuthOtp.create({
        userId: testUser._id,
        otp,
        createdAt: new Date(Date.now() - 11 * 60 * 1000)
      });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: testUser.email,
          otp
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired OTP');
    });
  });
}); 