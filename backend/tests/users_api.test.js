// userApi.test.js
const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/user');
const History = require('../models/history');
const Job = require('../models/job');
const Application = require('../models/application');
const AuthOtp = require('../models/authOtp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const base_url = "/api/v1/users";

describe('User API Tests', () => {
    let userAppId;
    let userManagerId;
    let jobId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL);

        // Create a applicant user for testing
        const user1 = new User({
            email: 'testapp@example.com',
            password: await bcrypt.hash('password', 10),
            name: 'Test User',
            role: 'Applicant',
        });
        await user1.save();
        userAppId = user1._id;
        
        // Create a manager user for testing
        const user2 = new User({
            email: 'testapp@example.com',
            password: await bcrypt.hash('password', 10),
            name: 'Test User',
            role: 'Applicant',
        });
        await user2.save();
        userManagerId = user2._id;
    });

    afterAll(async () => {
        // Clean up database and close connection
        await User.deleteMany({});
        await Job.deleteMany({});
        await History.deleteMany({});
        await Application.deleteMany({});
        await AuthOtp.deleteMany({});
        await mongoose.connection.close();
    });

    // 1. Test cases for user API
    test('POST /create-session - should create a session with valid credentials', async () => {
        const response = await request(app)
            .post(`${base_url}/create-session`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual("Sign In Successful, here is your token, please keep it safe");
    });

    // 2. Test for login with invalid credentials
    test('POST /create-session - should return 422 for invalid credentials', async () => {
        const response = await request(app)
            .post(`${base_url}/create-session`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        expect(response.status).toEqual(422);
    });

    // 3. Test for sign up with valid data
    test('POST /signup - should sign up with valid data', async () => {
        const response = await request(app)
            .post(`${base_url}/signup`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'newuser@example.com', password: 'newpassword', confirm_password: 'newpassword' });
        
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 4. Test for sign up with mismatched passwords
    test('POST /signup - should return 422 for mismatched passwords', async () => {
        const response = await request(app)
            .post(`${base_url}/signup`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'newuser2@example.com', password: 'password1', confirm_password: 'password2' });

        expect(response.status).toBe(422);
        expect(response.body.errors).toContain('Passwords do not match');
    });

    // 5. Test for editing profile with valid data
    test('POST /edit - should update profile with valid data', async () => {
        const response = await request(app)
            .post(`${base_url}/edit`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ id: userId, name: 'Updated User', role: 'User' });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 6. Test for getting profile by ID
    test('GET /getprofile/:id - should return user profile', async () => {
        const response = await request(app)
            .get(`${base_url}/getprofile/${userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.data.user.name).toBe('Test User');
    });

    // 7. Test for searching user
    test('GET /search/:name - should return users matching name', async () => {
        const response = await request(app)
            .get(`${base_url}/search/Test`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 8. Test for creating history
    test('POST /createhistory - should create history entry', async () => {
        const response = await request(app)
            .post(`${base_url}/createhistory`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ date: '2024-10-31', total: 500, burnout: 300, id: userId });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 9. Test for getting history
    test('GET /gethistory - should return user history', async () => {
        const response = await request(app)
            .get(`${base_url}/gethistory?id=${userId}&date=2024-10-31`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 10. Test for creating job
    test('POST /createjob - should create job', async () => {
        const response = await request(base_url)
            .post('/createjob')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                id: userId,
                name: 'Test Job',
                type: 'Full-Time',
                location: 'Remote',
                description: 'Test Job Description',
                pay: 50000,
                requiredSkills: ['JavaScript'],
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        jobId = response.body.data.job._id;
    });

    // 11. Test for fetching jobs
    test('GET / - should return list of jobs', async () => {
        const response = await request(app)
            .get(`${base_url}/`);

        expect(response.statusCode).toBe(200);
        expect(response.body.jobs.length).toBeGreaterThan(0);
    });

    // 12. Test for creating application
    test('POST /createapplication - should create application', async () => {
        const response = await request(base_url)
            .post('/createapplication')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                applicantid: userId,
                jobid: jobId,
                applicantname: 'Test Applicant',
                jobname: 'Test Job',
                managerid: userId,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 13. Test for fetching applications
    test('GET /fetchapplications - should return list of applications', async () => {
        const response = await request(app)
            .get(`${base_url}/fetchapplications`);

        expect(response.statusCode).toBe(200);
        expect(response.body.application.length).toBeGreaterThan(0);
    });

    // 14. Test for accepting application
    test('POST /acceptapplication - should accept application', async () => {
        const application = await Application.findOne({});
        const response = await request(base_url)
            .post('/acceptapplication')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ applicationId: application._id });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 15. Test for rejecting application
    test('POST /rejectapplication - should reject application', async () => {
        const application = await Application.findOne({});
        const response = await request(base_url)
            .post('/rejectapplication')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ applicationId: application._id });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 16. Test for closing job
    test('POST /closejob - should close job', async () => {
        const response = await request(base_url)
            .post('/closejob')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ jobid: jobId });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 17. Test for password reset (forgot-password)
    test('POST /forgot-password - should initiate password reset', async () => {
        const response = await request(base_url)
            .post('/forgot-password')
            .send({ email: 'test@example.com' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Password reset link has been sent to your email');
    });

    // 18. Test for extracting skills
    test('POST /extractSkills - should extract skills from the provided text', async () => {
        const response = await request(base_url)
            .post('/extractSkills')
            .send({ text: 'JavaScript, Python, Node.js' });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.skills).toContain('JavaScript');
    });

    // 18. Test for extracting skills
    test('POST /extractSkills - should extract skills from the provided description', async () => {
        const response = await request(base_url)
            .post('/extractSkills')
            .send({ text: 'JavaScript, Python, Node.js' });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.skills).toContain('JavaScript');
    });
});
