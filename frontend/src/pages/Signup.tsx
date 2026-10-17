import FormHeading from "@/components/shared/FormHeading.tsx";
import SignupForm from "@/components/SignupForm.tsx";

const Signup = () => {
  return (
    <main className={`min-h-dvh bg-background `}>
      <div
        className={"container flex flex-col justify-center items-center gap-4"}
      >
        <FormHeading />
        <SignupForm />
      </div>
    </main>
  );
};
export default Signup;
