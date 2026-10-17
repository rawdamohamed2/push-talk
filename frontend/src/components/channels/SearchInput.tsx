import { Field, FieldLabel } from "@/components/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import type { signUpData } from "@/types/auth.type.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupValues } from "@/schemas/auth.schema.ts";
import { useNavigate } from "react-router-dom";
import { getPasswordStrength } from "@/lib/passwordStrength.ts";

const SearchForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<signUpData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    criteriaMode: "all",
  });
  const navigate = useNavigate();
  const password = watch("password", "");
  const { level } = getPasswordStrength(password);

  const onSubmit = ({ username, password }: SignupValues) => {
    console.log(username, password);
  };
  return (
    <form onSubmit={onSubmit}>
      <Field>
        <InputGroup>
          <InputGroupInput
            type={"text"}
            aria-label={"Search channels"}
            {...register("")}
            placeholder={"Search channels, tags, or kHz..."}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
};
export default SearchForm;
