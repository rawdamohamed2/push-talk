import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { ArrowRight, Loader, Lock, SquareUserRound } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { loginData, signUpData } from "@/types/auth.type.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/auth.schema.ts";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements.tsx";
import { getPasswordStrength, STYLES } from "@/lib/passwordStrength.ts";
import { useSignup } from "@/hooks/queries/useAuth.ts";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<signUpData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    criteriaMode: "all",
  });
  const password = watch("password", "");
  const { level } = getPasswordStrength(password);
  const signup = useSignup();

  const onSubmit = (data: signUpData) => {
    const user: loginData = {
      username: data.username,
      password: data.password,
    };
    signup.mutate(user);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`md:w-md w-full flex flex-col gap-4 bg-muted sm:px-10 px-6  py-10 rounded-xl`}
    >
      {signup.isError && (
        <p className={`text-on-error bg-error rounded-md p-3 text-sm `}>
          {signup.error.message}
        </p>
      )}
      <FieldGroup>
        <Field>
          <FieldLabel className={`from-label`} htmlFor="email">
            Username
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              type={"text"}
              aria-label={"Username"}
              placeholder={"Alex Rivers"}
              {...register("username")}
            />
            <InputGroupAddon>
              <SquareUserRound />
            </InputGroupAddon>
          </InputGroup>
          {errors.username && (
            <FieldError>{errors.username.message}</FieldError>
          )}
        </Field>
        <Field>
          <div className={`flex justify-between items-center`}>
            <FieldLabel className={`from-label`} htmlFor="password">
              password
            </FieldLabel>
            {password && (
              <span className={`text-xs font-semibold ${STYLES[level].text}`}>
                {STYLES[level].label}
              </span>
            )}
          </div>
          <InputGroup>
            <InputGroupInput
              type={"password"}
              aria-label={"password"}
              placeholder={"SuperP@ssw0rd!"}
              {...register("password")}
            />
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
          </InputGroup>
          <PasswordRequirements value={password} />
        </Field>
        <Field>
          <FieldLabel className={`from-label`} htmlFor="email">
            password confirmation
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              type={"password"}
              aria-label={"password_confirmation"}
              placeholder={"SuperP@ssw0rd!"}
              {...register("password_confirmation")}
            />
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
          </InputGroup>
          {errors.password_confirmation && (
            <FieldError>{errors.password_confirmation.message}</FieldError>
          )}
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="Terms of Service"
            name="Terms of Service"
            aria-label={"agree to Terms of Service and Privacy Policy"}
            defaultChecked
          />
          <FieldContent>
            <FieldLabel className={`text-sm`} htmlFor="Remember me">
              I agree to PushTalk's Terms of Service and Privacy Policy
            </FieldLabel>
          </FieldContent>
        </Field>
        <Button
          className={`w-full h-11
          text-xs font-semibold disabled:bg-primary-container/80
          `}
          aria-label="Submit"
          type={"submit"}
          disabled={signup.isPending}
        >
          {signup.isPending ? (
            <span className={` flex justify-center items-center gap-1 `}>
              <span>Signing up</span>
              <Loader className={`animate-spin`} />
            </span>
          ) : (
            <span className={` flex justify-center items-center gap-1 `}>
              <span>Get Started with PushTalk</span>
              <ArrowRight />
            </span>
          )}
        </Button>
      </FieldGroup>
      <FieldSeparator />
      <p className={`flex items-center justify-center gap-1 text-sm`}>
        New here?
        <Link
          to={"/"}
          className={`text-secondary no-underline hover:underline ease-in-out  duration-200 transition-all `}
        >
          Log in
        </Link>
      </p>
    </form>
  );
};
export default SignupForm;
