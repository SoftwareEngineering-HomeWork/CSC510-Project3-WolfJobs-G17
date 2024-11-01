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
            name: 'Applicant Test User',
            role: 'Applicant',
        });
        await user1.save();
        userAppId = user1._id;

        // Create a manager user for testing
        const user2 = new User({
            email: 'testmanager@example.com',
            password: await bcrypt.hash('password', 10),
            name: 'ManagerTest User',
            affiliation: 'nc-state-dining',
            role: 'Manager',
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

    // 1. Dummy route for gettign 404 error
    test('POST /dummy - should return 404 page not found', async () => {
        const response = await request(app)
            .post(`${base_url}/dummy`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        expect(response.status).toEqual(404);
    });

    // 2. Test cases for user API
    test('POST /create-session - should create a session with valid credentials', async () => {
        const response = await request(app)
            .post(`${base_url}/create-session`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'testapp@example.com', password: 'password' });

        expect(response.status).toBe(200);
    });

    // 3. Test for create-session with invalid email
    test('POST /create-session - should return 422 for invalid email', async () => {
        const response = await request(app)
            .post(`${base_url}/create-session`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        expect(response.status).toEqual(422);
    });

    // 4. Test for create-session with invalid email
    test('POST /create-session - should return 422 for invalid password', async () => {
        const response = await request(app)
            .post(`${base_url}/create-session`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        expect(response.status).toEqual(422);
    });

    // 5. Test for sign up with valid data and missing the role which shoudl be included
    test('POST /signup - sign up with role and name not given', async () => {
        const response = await request(app)
            .post(`${base_url}/signup`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'newuser@example.com', password: 'newpassword', confirm_password: 'newpassword' });

        expect(response.status).toBe(500);
    });

    // 6. Test for sign up with valid data and missing the role which shoudl be included
    test('POST /signup - should sign up with valid data', async () => {
        const response = await request(app)
            .post(`${base_url}/signup`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'newuser@example.com', password: 'newpassword', confirm_password: 'newpassword', name: 'New Applicant User', role: 'Applicant' });

        expect(response.status).toBe(200);
    });

    // 7. Test for sign up with mismatched passwords
    test('POST /signup - should return 422 for mismatched passwords', async () => {
        const response = await request(app)
            .post(`${base_url}/signup`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ email: 'newuser2@example.com', password: 'password1', confirm_password: 'password2' });

        expect(response.status).toBe(422);
        expect(response.body.errors).toContain('Passwords do not match');
    });

    // 8. Test for editing profile with valid data
    test('POST /edit - should update profile with valid data', async () => {
        const response = await request(app)
            .post(`${base_url}/edit`)
            .send({ id: userManagerId, name: 'Updated Test Manager User', password: 'password', role: 'Manager' });

        expect(response.status).toBe(200);
    });

    // 9. Test for editing profile without valid data
    test('POST /edit - should update profile without valid data', async () => {
        const response = await request(app)
            .post(`${base_url}/edit`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ id: 123, name: 'Updated User' });

        expect(response.status).toBe(500);
    });

    // 10. Test for getting profile by ID
    test('GET /getprofile/:id - should return user profile', async () => {
        const response = await request(app)
            .get(`${base_url}/getprofile/${userAppId}`);

        expect(response.status).toBe(200);
        expect(response.body.data.user.name).toBe('Applicant Test User');
    });

    // 11. Test for getting profile by ID which is not present
    test('GET /getprofile/:id - should return user profile', async () => {
        const response = await request(app)
            .get(`${base_url}/getprofile/${123}`);

        expect(response.status).toBe(500);
    });

    // 12. Test for searching user
    test('GET /search/:name - should return users matching name', async () => {
        const response = await request(app)
            .get(`${base_url}/search/Applicant Test User`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 13. Test for searching user
    test('GET /search/:name - should return users matching name', async () => {
        const response = await request(app)
            .get(`${base_url}/search/Wrong Test User`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 14. Test for creating history
    test('POST /createhistory - should create history entry', async () => {
        const response = await request(app)
            .post(`${base_url}/createhistory`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ date: '2024-10-31', total: 500, burnout: 300, id: userAppId });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // 15. Test for getting history
    test('GET /gethistory - should return user history', async () => {
        const response = await request(app)
            .get(`${base_url}/gethistory?id=${userAppId}&date=2024-10-31`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });


    // 17. Test for creating job with insufficient data
    test('POST /createjob - should not create job with applicant as role', async () => {
        const response = await request(app)
            .post(`${base_url}/createjob`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                id: userAppId,
                name: 'Test Job',
                type: 'Full-Time',
                location: 'Remote',
                description: 'Test Job Description',
                pay: 10,
                requiredSkills: 'JavaScript',
            });

        expect(response.status).toBe(402);
    });

    // 17. Test for creating job with applicant role
    test('POST /createjob - should not create job with applicant as role', async () => {
        const response = await request(app)
            .post(`${base_url}/createjob`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                id: userAppId,
                name: 'Test Job',
                affiliation: 'Manager',
                type: 'Full-Time',
                location: 'Remote',
                description: 'Test Job Description',
                pay: '10',
                requiredSkills: 'JavaScript',
                question1: 'a?',
                question2: 'b?',
                question3: 'c?',
                question4: 'd?',
            });

        expect(response.status).toBe(402);
    });

    // 18. Test for creating job with manager as role
    test('POST /createjob - should create a job', async () => {
        const response = await request(app)
            .post(`${base_url}/createjob`)
            .send({
                id: userManagerId,
                name: 'Test Job',
                type: 'Full-Time',
                location: 'Remote',
                description: 'Test Job Description',
                pay: '10',
                requiredSkills: 'JavaScript',
                question1: 'a?',
                question2: 'b?',
                question3: 'c?',
                question4: 'd?',
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        jobId = response.body.data.job._id;
    });

    // 19. Test for fetching jobs
    test('GET / - should return list of jobs', async () => {
        const response = await request(app)
            .get(`${base_url}/`);

        expect(response.status).toBe(200);

        // As we have already added one job we will get more than one
        expect(response.body.jobs.length).toBeGreaterThan(0);
    });

    // 20. Test for creating application
    test('POST /extractSkills - should modify application', async () => {
        const response = await request(app)
            .post(`${base_url}/extractSkills`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                description: "1) Java is most used language in our systems"
                    + ", 2) Experience in Docker is a plus"
            });

        expect(response.status).toBe(200);
        expect(response.body.skills).toBe("Java, Docker");
    });
});