import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { ArrowRight, AtSign, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { loginData } from "@/types/auth.type.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schema.ts";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const onSubmit = (data: loginData) => console.log(data.username);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`md:w-md w-full flex flex-col gap-4 bg-muted sm:px-10 px-6  py-10 rounded-xl`}
    >
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
              <AtSign />
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
          {/*<FieldError>Validation message.</FieldError>*/}
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
          className={`w-full h-11 flex justify-center items-center gap-1 
          text-xs font-semibold disabled:bg-primary-container/20
          `}
          aria-label="Submit"
          type={"submit"}
          disabled={isSubmitting}
        >
          <span>Log in to PushTalk</span>
          <ArrowRight />
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
