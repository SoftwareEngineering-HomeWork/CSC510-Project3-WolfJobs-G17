import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../deprecateded/auth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, TextField, Button } from "@mui/material";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const schema = yup.object({
    newPassword: yup.string().required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your new password"),
  });

  const ResetPasswordPage = () => {
  
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    
    // Extract the token using the parameter name (e.g., "t")
    const token = queryParams.get('token');
      console.log(token);
      const navigate = useNavigate();
    
      const form = useForm<FormValues>({
        defaultValues: { newPassword: "", confirmPassword: "" },
        resolver: yupResolver(schema),
      });
      const { register, handleSubmit, formState } = form;
      const { errors } = formState;
    
      const onSubmit = async (data: FormValues) => {
        console.log(data.success);
        if (token) {
            console.log(token);
          try {
            await resetPassword(token, data.newPassword, navigate); // Pass navigate here
            navigate("/login"); // Redirect to login after successful reset
          } catch (error) {
            alert("Error resetting password"); // Handle error appropriately
          }
        }
      };

  return (
    <div className="mx-auto bg-slate-50 content flex flex-col justify-center items-center">
      <div className="p-4 border rounded bg-white">
        <div className="text-xl justify-center text-black mb-4 ">
          Reset Password
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} width={400}>
            <TextField
              label="New Password"
              type="password"
              {...register("newPassword")}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
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
              label="Confirm Password"
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{
                "& label": { paddingLeft: (theme) => theme.spacing(1) },
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
              Reset Password
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
