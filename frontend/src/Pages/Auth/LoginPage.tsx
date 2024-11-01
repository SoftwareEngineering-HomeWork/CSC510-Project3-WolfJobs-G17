import { useState } from "react"; // Import useState
import { useNavigate } from "react-router-dom";
import { login } from "../../deprecateded/auth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Stack,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons

type FormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const form = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    console.log("form submitted");
    console.log(data);
    login(data.email, data.password, navigate);
  };

  return (
    <>
      <div className="mx-auto bg-slate-50 content flex flex-col justify-center items-center">
        <div className="p-4 border rounded bg-white">
          <div className="text-xl justify-center text-black mb-4">
            Sign In to your Account
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} width={400}>
              <TextField
                label="Email Id"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& label": { paddingLeft: (theme) => theme.spacing(1) },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                {...register("password", {
                  required: "Password is required",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}{" "}
                        {/* Show icon based on state */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& label": {
                    paddingLeft: (theme) => theme.spacing(1),
                  },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  background: "#FF5353",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                Login
              </Button>
            </Stack>
          </form>
          <div className="flex justify-end mt-2">
            <p
              className="text-[#656565] cursor-pointer text-sm"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password?
            </p>
          </div>
          <div className="mv-1 border-t mx-16" />
          <div className="flex justify-center">
            <p className="-mt-3 bg-white px-3 text-[#CCCCCC]">OR</p>
          </div>
          <br />
          <p
            className="text-[#656565] text-center hover:text-blue-500 cursor-pointer"
            onClick={() => {
              navigate("/register");
            }}
          >
            Create a new account
          </p>
        </div>
      </div>
      {/* <DevTool control={control}></DevTool> */}
    </>
  );
};

export default LoginPage;
