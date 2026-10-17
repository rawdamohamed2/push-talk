import LoginForm from "@/components/LoginForm.tsx";
import FromHeading from "@/components/shared/FromHeading.tsx";

const Login = () => {
  return (
    <main className={`min-h-dvh bg-background `}>
      <div
        className={"container flex flex-col justify-center items-center gap-4"}
      >
        <FromHeading />
        <LoginForm />
      </div>
    </main>
  );
};
export default Login;
