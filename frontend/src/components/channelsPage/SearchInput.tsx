import { Search } from "lucide-react";
import { Field } from "@/components/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { useRef } from "react";

interface SearchInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  onChange,
  placeholder = "Search channelsPage...",
}: SearchInputProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  return (
    <Field>
      <InputGroup>
        <InputGroupInput
          type="search"
          aria-label="Search channels"
          ref={searchRef}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
