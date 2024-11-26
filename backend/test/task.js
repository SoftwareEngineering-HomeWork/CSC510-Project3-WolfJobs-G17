let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const autoOtp = require('../models/authOtp');
const { generateOTPEmailTemplate } = require('../utils/emailTemplates');

chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {

    describe("GET /api/v1/users/fetchapplications" , () => {

        it("IT SHOULD RETURN ALL THE APPLICATIONS" , (done) => {
            // const task = {
            //     email:'shaangzb@gmail.com',
            //     password:'123',
                
            // };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/fetchapplications")
                
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

    describe("GET /api/v1/users/" , () => {

        it("IT SHOULD RETURN ALL THE JOBS" , (done) => {
            // const task = {
            //     email:'shaangzb@gmail.com',
            //     password:'123',
                
            // };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/")
                
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

    describe("GET /api/v1/users/" , () => {

        it("IT SHOULD RETURN ALL THE JOBS" , (done) => {
            // const task = {
            //     email:'shaangzb@gmail.com',
            //     password:'123',
                
            // };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/")
                
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

    describe("POST /api/v1/users/createjob" , () => {

        it("IT SHOULD RETURN THE JOB" , (done) => {
            const body = {
                
                name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10',
                
            };

            chai.request('http://localhost:8000')
                .post("/api/v1/users/createjob")
                .send({name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10'})
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })


    describe("GET /api/v1/users/search" , () => {

        it("IT SHOULD RETURN THE SEARCHED JOB" , (done) => {
            const body = {
                
                name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10',
                
            };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/search/TA")
                // .send(body)
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body.users)
                  

                done();

                });
        })

    })

    describe("POST /api/v1/users/create-session" , () => {

        it("IT SHOULD RETURN THE USER" , (done) => {
            const body = 
                {email:'boss@gmail.com',
                password:'123',
                
        };
            chai.request('http://localhost:8000')
                .post("/api/v1/users/create-session")
                .send(body)
               
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

    describe("2FA and OTP Authentication", () => {
        it("should generate OTP and send email", (done) => {
            const user = {
                email: 'test@example.com',
                userId: '12345'
            };

            chai.request('http://localhost:8000')
                .post("/api/auth/generate-otp")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success').eq(true);
                    response.body.should.have.property('message').eq('OTP sent successfully');
                    done();
                });
        });

        it("should verify valid OTP", (done) => {
            const testData = {
                email: 'test@example.com',
                otp: '123456'
            };

            chai.request('http://localhost:8000')
                .post("/api/auth/verify-otp")
                .send(testData)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success').eq(true);
                    done();
                });
        });

        it("should reject invalid OTP", (done) => {
            const testData = {
                email: 'test@example.com',
                otp: '000000'
            };

            chai.request('http://localhost:8000')
                .post("/api/auth/verify-otp")
                .send(testData)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.have.property('success').eq(false);
                    response.body.should.have.property('message').eq('Invalid OTP');
                    done();
                });
        });

        it("should reject expired OTP", (done) => {
            // First create an expired OTP record
            const expiredOtp = new autoOtp({
                userId: '12345',
                otp: '123456',
                createdAt: new Date(Date.now() - 11 * 60 * 1000) // 11 minutes ago
            });

            expiredOtp.save().then(() => {
                chai.request('http://localhost:8000')
                    .post("/api/auth/verify-otp")
                    .send({
                        email: 'test@example.com',
                        otp: '123456'
                    })
                    .end((err, response) => {
                        response.should.have.status(400);
                        response.body.should.have.property('success').eq(false);
                        response.body.should.have.property('message').eq('OTP has expired');
                        done();
                    });
            });
        });

        it("should handle multiple OTP verification attempts", (done) => {
            const attempts = Array(3).fill({
                email: 'test@example.com',
                otp: '123456'
            });

            Promise.all(attempts.map(() => 
                chai.request('http://localhost:8000')
                    .post("/api/auth/verify-otp")
                    .send(attempts[0])
            )).then((responses) => {
                responses[responses.length - 1].should.have.status(400);
                responses[responses.length - 1].body.should.have.property('message')
                    .eq('Too many attempts. Please request a new OTP');
                done();
            });
        });
    });

    describe("Email Template Tests", () => {
        it("should generate valid email template", (done) => {
            const html = generateOTPEmailTemplate('John', '123456');
            
            html.should.be.a('string');
            html.should.include('John');
            html.should.include('123456');
            html.should.include('WolfJobs');
            html.should.include('expire in 10 mins');
            done();
        });

        it("should handle special characters in email template", (done) => {
            const html = generateOTPEmailTemplate('John & <script>alert("xss")</script>', '123456');
            
            html.should.not.include('<script>');
            html.should.include('&amp;');
            html.should.include('John');
            done();
        });

        it("should include all required template elements", (done) => {
            const html = generateOTPEmailTemplate('John', '123456');
            
            html.should.include('wolfjobs.jpg'); // Logo
            html.should.include('Team WolfJobs'); // Company name
            html.should.include('One Time Password'); // OTP heading
            html.should.include('expire in 10 mins'); // Expiry message
            done();
        });

        it("should handle empty or null inputs gracefully", (done) => {
            const html = generateOTPEmailTemplate('', null);
            
            html.should.be.a('string');
            html.should.include('User'); // Default fallback
            html.should.not.include('null');
            html.should.not.include('undefined');
            done();
        });

        it("should maintain proper HTML structure", (done) => {
            const html = generateOTPEmailTemplate('John', '123456');
            
            html.should.match(/<!doctype html>/i);
            html.should.include('</html>');
            html.should.include('<head>');
            html.should.include('<body');
            done();
        });
    });

    describe("Integration Tests: Login with 2FA", () => {
        it("should complete full login flow with 2FA", (done) => {
            // Step 1: Login
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            chai.request('http://localhost:8000')
                .post("/api/v1/users/create-session")
                .send(loginData)
                .end((err, loginResponse) => {
                    loginResponse.should.have.status(200);
                    const userId = loginResponse.body.data.user._id;

                    // Step 2: Generate OTP
                    chai.request('http://localhost:8000')
                        .post("/api/auth/generate-otp")
                        .send({ email: loginData.email, userId })
                        .end((err, otpResponse) => {
                            otpResponse.should.have.status(200);

                            // Step 3: Verify OTP (using the most recent OTP from database)
                            autoOtp.findOne({ userId })
                                .sort({ createdAt: -1 })
                                .then(otpRecord => {
                                    chai.request('http://localhost:8000')
                                        .post("/api/auth/verify-otp")
                                        .send({
                                            email: loginData.email,
                                            otp: otpRecord.otp
                                        })
                                        .end((err, verifyResponse) => {
                                            verifyResponse.should.have.status(200);
                                            verifyResponse.body.should.have.property('success').eq(true);
                                            done();
                                        });
                                });
                        });
                });
        });
    });

})