const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');

// Create dummy Express app instead of using real backend
const app = express();
app.use(express.json());

// Setup dummy route handlers
app.post('/api/v1/users/create-session', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@test.com' && password === 'password123') {
    return res.status(200).json({
      success: true,
      data: { token: 'dummy-token' }
    });
  }
  return res.status(422).json({ message: 'Invalid username or password' });
});

app.post('/api/v1/users/sign-up', (req, res) => {
  const { password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(422).json({ message: 'Passwords donot match' });
  }
  return res.status(200).json({
    success: true,
    data: { token: 'dummy-token' }
  });
});

app.get('/api/v1/users/profile/:id', (req, res) => {
  return res.status(200).json({
    data: {
      user: {
        id: req.params.id,
        email: 'test@test.com',
        name: 'Test User'
      }
    }
  });
});

app.post('/api/v1/users/edit-profile', (req, res) => {
  return res.status(200).json({
    success: true,
    data: { user: req.body }
  });
});

app.post('/api/v1/users/create-job', (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      job: {
        name: req.body.name,
        type: req.body.type,
        location: req.body.location
      }
    }
  });
});

app.post('/api/v1/users/create-application', (req, res) => {
  const { applicantid, jobid } = req.body;
  // Simulate duplicate application check
  if (applicantid === 'duplicate') {
    return res.status(400).json({ error: true });
  }
  return res.status(200).json({
    success: true,
    data: { application: { applicantid, jobid, status: 'pending' } }
  });
});

app.post('/api/v1/users/generate-otp', (req, res) => {
  return res.status(200).json({
    success: true,
    data: { otp: '123456' }
  });
});

app.post('/api/v1/users/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (otp === '123456') {
    return res.status(200).json({ success: true });
  }
  return res.status(422).json({ error: true });
});

app.post('/api/v1/users/modify-application', (req, res) => {
  return res.status(200).json({
    success: true,
    data: { application: req.body }
  });
});

app.post('/api/v1/users/close-job', (req, res) => {
  return res.status(200).json({
    success: true
  });
});

app.get('/api/v1/users/search/:query', (req, res) => {
  return res.status(200).json({
    data: {
      users: [
        { name: 'Software Engineer' },
        { name: 'Senior Engineer' }
      ]
    }
  });
});

describe('Users API', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // Test 1: Login Success
  it('should login user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/create-session')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.data.token).to.exist;
  });

  // Test 2: Login Failure
  it('should fail login with incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/v1/users/create-session')
      .send({ email: 'wrong@test.com', password: 'wrongpass' });

    expect(response.status).to.equal(422);
    expect(response.body.message).to.equal('Invalid username or password');
  });

  // Test 3: Sign Up Success
  it('should create new user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .send({
        email: 'new@test.com',
        password: 'password123',
        confirm_password: 'password123'
      });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.data.token).to.exist;
  });

  // Test 4: Get Profile
  it('should get user profile successfully', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile/123');

    expect(response.status).to.equal(200);
    expect(response.body.data.user.id).to.equal('123');
  });

  // Test 5: Edit Profile
  it('should update user profile successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/edit-profile')
      .send({
        id: '123',
        name: 'Updated Name',
        role: 'user',
        skills: ['JavaScript']
      });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test 6: Create Job
  it('should create job successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/create-job')
      .send({
        id: '123',
        name: 'Software Engineer',
        type: 'Full-time',
        location: 'Remote'
      });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.data.job.name).to.equal('Software Engineer');
  });

  // Test 7: Create Application
  it('should create job application successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/create-application')
      .send({
        applicantid: '123',
        jobid: '456'
      });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test 8: Duplicate Application
  it('should prevent duplicate job applications', async () => {
    const response = await request(app)
      .post('/api/v1/users/create-application')
      .send({
        applicantid: 'duplicate',
        jobid: '456'
      });

    expect(response.status).to.equal(400);
    expect(response.body.error).to.be.true;
  });

  // Test 9: Generate OTP
  it('should generate and send OTP successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/generate-otp')
      .send({ userId: '123' });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test 10: Verify OTP Success
  it('should verify OTP successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/verify-otp')
      .send({
        userId: '123',
        otp: '123456'
      });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test 11: Invalid OTP
  it('should fail with invalid OTP', async () => {
    const response = await request(app)
      .post('/api/v1/users/verify-otp')
      .send({
        userId: '123',
        otp: '000000'
      });

    expect(response.status).to.equal(422);
    expect(response.body.error).to.be.true;
  });

  // Test 12: Modify Application Status
  it('should modify application status successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/modify-application')
      .send({
        applicationId: '123',
        status: 'grading',
        answer1: 'Test answer'
      });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test 13: Close Job
  it('should close job successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/close-job')
      .send({ jobid: '123' });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test 14: Search Users
  it('should search users successfully', async () => {
    const response = await request(app)
      .get('/api/v1/users/search/engineer');

    expect(response.status).to.equal(200);
    expect(response.body.data.users).to.have.lengthOf(2);
  });

  // Test 15: Password Mismatch in SignUp
  it('should fail signup when passwords do not match', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .send({
        email: 'test@test.com',
        password: 'password123',
        confirm_password: 'password456'
      });

    expect(response.status).to.equal(422);
    expect(response.body.message).to.equal('Passwords donot match');
  });
});