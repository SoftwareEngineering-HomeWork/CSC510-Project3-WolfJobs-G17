# APIs

## Login

Method: `POST`

`/api/v1/users/create-session`

Response: 1

```sh
res.json(422, {
        message: "Invalid username or password",
      });
```

Response: 2

```sh
res.json(200, {
      message: "Sign In Successful, here is your token, please keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), "wolfjobs", { expiresIn: "100000" }),
        user: user,
      },
      success: true,
    });
```

## Sign Up

Method: `POST`

`/api/v1/users/signup`

Response: 1

```sh
res.json(422, {
        message: "Passwords donot match",
      });
```

Response: 2

```sh
res.json(200, {
          message: "Sign Up Successful, here is your token, plz keep it safe",
          data: {
            token: jwt.sign(user.toJSON(), "wolfjobs", {
              expiresIn: "100000",
            }),
            user,
          },
          success: true,
        })
```

Response: 3

```sh
res.json(500, {
      message: "Internal Server Error",
    });
```

## Edit Profile

Method: `POST`

`/api/v1/users/edit`

Response 1:

```sh
res.json(200, {
      message: "User is updated Successfully",
      data: {
        user,
      },
      success: true,
    });
```

Response 2:

```sh
res.json(500, {
        message: "Internal Server Error",
      });
```

Response 3:

```sh
res.json(400, {
      message: "Bad Request",
    });
```

## Create Job

Method: `POST`

`/api/v1/users/createjob`

Response 1:

```sh
res.json(200, {
      data: {
        job: job,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Job Created!!",
      success: true,
    });
```

Response 2:

```sh
res.json(500, {
      message: "NOT CREATED",
    });
```

## Close Job

Method: `POST`

`/api/v1/users/closejob`

Response 1:

```sh
res.json(200, {
      message: "Job is updated Successfully",

      data: {
        job,
      },
      success: true,
    });
```

Response 2:

```sh
res.json(500, {
      message: "Internal Server Error",
    });
```

## Create Application

Method: `POST`

`/api/v1/users/createapplication`

Response 1:

```sh
res.json(400, {
        message: "You have already applied for the job",
        error: true,
      });
```

Response 2:

```sh
res.json(200, {
      data: {
        application: application,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Job Created!!",
      success: true,
    });
```

Response 3:

```sh
res.json(500, {
      message: "NOT CREATED",
    });
```

# APIs

## Forgot Password

Method: `POST`

`/api/v1/users/forgot-password`

Response: 1

```sh
res.status(404).json({
      message: "User not found",
    });

res.status(200).json({
      message: "Password reset link has been sent to your email",
    });

res.status(500).json({
      message: "Internal Server Error",
    });


# APIs

## Reset Password

Method: `POST`

`/api/v1/users/reset-password`

### Description:
This API allows a user to reset their password using a token received from the password reset email. The request must include the token and the new password.

### Request Body:
- `token`: The reset token received via email (string, required)
- `newPassword`: The new password to be set (string, required, minimum 6 characters)

### Response:

**Response 1: User Not Found**
```sh
res.status(404).json({
  message: "User not found",
});

res.status(200).send({
  message: "Password reset successful",
});

res.status(500).json({
  message: "Internal Server Error",
});

{
  "token": "exampleResetToken123",
  "newPassword": "newSecurePassword"
}

{
  "message": "Password reset successful"
}

{
  "message": "User not found"
}

{
  "message": "Internal Server Error"
}

This provides a complete and well-formatted description for the **Reset Password** API, including details on the request, expected responses, and example JSON objects.

