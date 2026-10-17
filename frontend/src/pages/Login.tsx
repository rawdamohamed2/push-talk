import LoginForm from "@/components/LoginForm.tsx";
import FormHeading from "@/components/shared/FormHeading.tsx";

const Login = () => {
  return (
    <main className={`min-h-dvh bg-background `}>
      <div
        className={"container flex flex-col justify-center items-center gap-4"}
      >
        <FormHeading />
        <LoginForm />
      </div>
    </main>
  );
};
export default Login;
