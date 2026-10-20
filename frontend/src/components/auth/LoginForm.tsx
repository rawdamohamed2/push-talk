import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field.tsx";
import { ArrowRight, Loader, Lock, SquareUserRound } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { loginData } from "@/types/auth.type.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schema.ts";
import { useLogin } from "@/hooks/queries/useAuth.ts";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const login = useLogin();

  const onSubmit = (data: loginData) => login.mutate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`md:w-md w-full flex flex-col gap-4 bg-muted sm:px-10 px-6 py-10 rounded-xl`}
    >
      {login.isError && (
        <p className={`text-on-error bg-error rounded-md p-3 text-sm `}>
          {login.error.message}
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
              placeholder={"alex.echo@pushtalk.io"}
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
          <FieldLabel className={`from-label`} htmlFor="password">
            password
          </FieldLabel>
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
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="Remember me"
            name="Remember me"
            aria-label={"Remember me"}
            defaultChecked
          />
          <FieldContent>
            <FieldLabel className={`text-sm`} htmlFor="Remember me">
              Remember Me
            </FieldLabel>
          </FieldContent>
        </Field>
        <Button
          className={`w-full h-11  
          text-xs font-semibold disabled:bg-primary-container/80
          `}
          aria-label="Submit"
          type={"submit"}
          disabled={login.isPending}
        >
          {login.isPending ? (
            <span className={`flex justify-center items-center gap-1`}>
              <span>Logging in</span>
              <Loader className={`animate-spin`} />
            </span>
          ) : (
            <span className={`flex justify-center items-center gap-1`}>
              <span>Log in to PushTalk</span>
              <ArrowRight />
            </span>
          )}
        </Button>
      </FieldGroup>
      <FieldSeparator />
      <p className={`flex items-center justify-center gap-1 text-sm`}>
        New here?
        <Link
          to={"/sign-up"}
          className={`text-secondary no-underline hover:underline ease-in-out  duration-200 transition-all `}
        >
          Create an account
        </Link>
      </p>
    </form>
  );
};
export default LoginForm;
