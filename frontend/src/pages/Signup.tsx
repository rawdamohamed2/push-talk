import FormHeading from "@/components/auth/FormHeading.tsx";
import SignupForm from "@/components/auth/SignupForm.tsx";

const Signup = () => {
  return (
    <main className={`min-h-dvh bg-background `}>
      <div
        className={
          "container min-h-dvh flex flex-col justify-center items-center gap-4"
        }
      >
        <FormHeading />
        <SignupForm />
      </div>
    </main>
  );
};
export default Signup;
