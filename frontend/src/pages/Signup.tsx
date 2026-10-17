import FromHeading from "@/components/shared/FromHeading.tsx";
import SignupForm from "@/components/SignupForm.tsx";

const Signup = () => {
  return (
    <main className={`min-h-dvh bg-background `}>
      <div
        className={"container flex flex-col justify-center items-center gap-4"}
      >
        <FromHeading />
        <SignupForm />
      </div>
    </main>
  );
};
export default Signup;
