import { useState } from "react";
import { AxiosError } from "axios";
import { NavLink } from "react-router";
import { HiOutlineXCircle } from "react-icons/hi";
import { z } from "zod";

import { Icon } from "@presentation/components/icon";
import { Input } from "@presentation/components/input";
import { Button } from "@presentation/components/button";
import { useForm } from "@presentation/hooks/use-form/use-form";
import container from "@infra/inversify/container";
import { SignUpUseCase } from "@application/use-cases/sign-up-use-case";
import { useAuth } from "@presentation/hooks/use-auth";

const signUpUseCase = container.get(SignUpUseCase);

const validationSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export const SignUpScreen = () => {
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const { loadData } = useAuth();
  const { errors, isSubmitting, touched, getFieldProps, handleSubmit } =
    useForm({
      initialValues: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      onSubmit: async (values, { setIsSubmitting }) => {
        try {
          setSignUpError(null);
          setIsSubmitting(true);
          await signUpUseCase.execute({
            name: values.name,
            email: values.email,
            password: values.password,
          });
          await loadData();
        } catch (error) {
          setIsSubmitting(false);
          if (error instanceof AxiosError) {
            if (error.status === 401) {
              setSignUpError("Invalid email or password.");
            }
            if (error.status === 409) {
              setSignUpError("User already exists.");
            }
          }
        }
      },
      validationSchema,
    });

  return (
    <div className="w-full h-screen flex">
      <div className="m-auto bg-base-200 p-8 rounded-box space-y-4 max-w-lg">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {signUpError && (
            <div role="alert" className="alert alert-error">
              <Icon Icon={HiOutlineXCircle} />
              <span>{signUpError}</span>
            </div>
          )}

          <Input
            id="name"
            type="name"
            required
            fullWidth
            placeholder="Name"
            label="Name"
            {...getFieldProps("name")}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name ? errors.name : undefined}
          />

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

          <Input
            id="passwordConfirmation"
            type="password"
            required
            fullWidth
            placeholder="Confirm Password"
            label="Confirm Password"
            {...getFieldProps("passwordConfirmation")}
            error={
              touched.passwordConfirmation &&
              Boolean(errors.passwordConfirmation)
            }
            helperText={
              touched.passwordConfirmation && errors.passwordConfirmation
                ? errors.passwordConfirmation
                : undefined
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
            <NavLink to="/sign-in" className="link">
              Already have an account? Sign In
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};
