import { toast } from "react-toastify";
import { getFormBody } from "./apiUtils";
import { loginURL, signupURL } from "../api/constants";

export async function login(email: string, password: string, navigate: any) {
  try {
    const loginResponse = await fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: getFormBody({ email, password }),
    });
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      // Generate OTP
      const otpResponse = await fetch('http://localhost:8000/api/auth/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          userId: loginData.data.user._id 
        }),
      });
      
      const otpData = await otpResponse.json();
      
      if (otpData.success) {
        localStorage.setItem("tempToken", loginData.data.token);
        navigate("/verify-otp", { state: { email } });
        return;
      }
    }
    toast.error("Login Failed");
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login Failed");
  }
}

export async function verifyOTP(email: string, otp: string, navigate: any) {
  try {
    const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    
    if (data.success) {
      // Move temporary token to permanent token
      const token = localStorage.getItem("tempToken");
      if (token) {
        localStorage.setItem("token", token);
        localStorage.removeItem("tempToken");
        navigate("/dashboard");
      }
      return true;
    }
    toast.error("Invalid OTP");
    return false;
  } catch (error) {
    toast.error("OTP Verification Failed");
    return false;
  }
}

export function signup(
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  role: string,
  affiliation: string,
  skills: string,
  navigate: any
) {
  const url = signupURL;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: getFormBody({
      email,
      password,
      confirm_password: confirmPassword,
      name,
      role,
      skills,
      affiliation,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        navigate("/login");
        return;
      }
      toast.error("Sign up Failed");
    });
}
