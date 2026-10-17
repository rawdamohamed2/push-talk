import LoginForm from "@/components/auth/LoginForm.tsx";
import FormHeading from "@/components/auth/FormHeading.tsx";

const Login = () => {
  return (
    <main className={`min-h-dvh bg-background `}>
      <div
        className={
          "container min-h-dvh flex flex-col justify-center items-center gap-4"
        }
      >
        <FormHeading />
        <LoginForm />
      </div>
    </main>
  );
};
export default Login;
