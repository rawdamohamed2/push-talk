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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";

const ChannelDialog = () => {
  return (
    <Dialog>
      <DialogTrigger
        className={`bg-primary-fixed-dim text-on-primary-container p-2 rounded-md font-semibold tracking-[-0.08px] leading-[24px] w-full `}
      >
        + New Channel
      </DialogTrigger>
      <form>
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
                />
              </InputGroup>
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
export default ChannelDialog;
