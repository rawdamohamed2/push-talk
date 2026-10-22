import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@base-ui/react/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { newChannel } from "@/types";
import { NewChannelSchema } from "@/schemas/channel.schema.ts";
import { useCreateChannel } from "@/hooks/queries/useChannels.ts";
import { toast } from "sonner";
import { useState } from "react";

const NewChannelDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<newChannel>({
    resolver: zodResolver(NewChannelSchema),
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      name: "",
    },
  });
  const createChannelMutation = useCreateChannel();
  const createNewChannel = (data: newChannel) => {
    createChannelMutation.mutate(data, {
      onSuccess: () => {
        toast.success("The channel created!");

        reset({ name: "" });
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`bg-primary-fixed-dim text-on-primary-container p-2 rounded-md font-semibold tracking-[-0.08px] leading-[24px] w-full `}
      >
        + New Channel
      </DialogTrigger>
      <form onSubmit={handleSubmit(createNewChannel)}>
        <DialogContent className="sm:max-w-md pt-7">
          <DialogHeader className="text-center my-2 text-lg font-semibold">
            <DialogTitle>Add New Channel</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel className={`from-label`} htmlFor="email">
                Channel Name
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type={"text"}
                  aria-label={"Channel Name"}
                  placeholder={"frontend developer community"}
                  {...register("name")}
                />
              </InputGroup>
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
          </FieldGroup>
          <DialogFooter className={`gap-4`}>
            <DialogClose
              className={`border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground  p-2 rounded-md font-semibold tracking-[-0.08px] leading-[24px]`}
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSubmit(createNewChannel)}
              className={`bg-primary-fixed-dim text-on-primary-container p-2 rounded-md font-semibold tracking-[-0.08px] leading-[24px]`}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default NewChannelDialog;
