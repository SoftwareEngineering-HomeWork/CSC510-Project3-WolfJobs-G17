import { useNavigate } from "react-router-dom";
import { sendForgotPasswordEmail } from "../../deprecateded/auth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, TextField, Button } from "@mui/material";

type FormValues = {
  email: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    sendForgotPasswordEmail(data.email, navigate);
  };

  return (
    <div className="mx-auto bg-slate-50 content flex flex-col justify-center items-center">
      <div className="p-4 border rounded bg-white">
        <div className="text-xl justify-center text-black mb-4 ">
          Forgot Password
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} width={400}>
            <TextField
              label="Email Id"
              type="email"
              {...register("email")}
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
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
