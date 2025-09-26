import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { HiOutlineXCircle } from "react-icons/hi";
import { AxiosError } from "axios";

import { Button } from "@presentation/components/button";
import { Icon } from "@presentation/components/icon";
import { Input } from "@presentation/components/input";
import { useForm } from "@presentation/hooks/use-form/use-form";
import z from "zod";
import container from "@infra/inversify/container";
import { SignInUseCase } from "@application/use-cases/sign-in-use-case";

const validationSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const signInUseCase = container.get(SignInUseCase);

export const SignInScreen = () => {
  const [signInError, setSignInError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { errors, isSubmitting, touched, getFieldProps, handleSubmit } =
    useForm({
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit(values, { setIsSubmitting }) {
        try {
          setIsSubmitting(true);
          setSignInError(null);
          navigate("/");
          signInUseCase.execute({
            email: values.email,
            password: values.password,
          });
        } catch (error) {
          setIsSubmitting(false);
          if (error instanceof AxiosError) {
            if (error.status === 401) {
              setSignInError("Invalid email or password.");
            }
          }
        }
      },
      validationSchema,
    });

  return (
    <div className="w-full h-screen flex">
      <div className="m-auto bg-base-200 p-8 rounded-box space-y-4 max-w-lg">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {signInError && (
            <div role="alert" className="alert alert-error">
              <Icon Icon={HiOutlineXCircle} />
              <span>{signInError}</span>
            </div>
          )}

          <Input
            id="email"
            type="email"
            required
            fullWidth
            placeholder="Email"
            label="Email"
            {...getFieldProps("email")}
            error={touched.email && Boolean(errors.email)}
            helperText={
              touched.email && errors.email ? errors.email : undefined
            }
          />

          <Input
            id="password"
            type="password"
            required
            fullWidth
            placeholder="Password"
            label="Password"
            {...getFieldProps("password")}
            error={touched.password && Boolean(errors.password)}
            helperText={
              touched.password && errors.password ? errors.password : undefined
            }
          />

          <Button
            type="submit"
            className="btn-primary btn-block"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>

          <div className="text-center">
            <NavLink to="/sign-up" className="link">
              Create an account
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};
