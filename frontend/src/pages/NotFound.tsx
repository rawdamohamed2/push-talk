import NotFoundContent from "@/components/layout/NotFoundContent.tsx";

const NotFound = () => {
  return (
    <main className={`relative min-h-dvh`}>
      <div
        className={`absolute bottom-0 start-0 bg-secondary/10 blur-3xl w-80 h-80 rounded-full`}
      ></div>
      <div
        className={`absolute top-0 start-1/2 -translate-x-1/2 bg-linear-to-b from-primary-container/20 from-0% via-secondary/10 via-50% to-secondary/10 to-100% blur-3xl w-140 h-50 rounded-full`}
      ></div>
      <div
        className={`absolute bottom-20 end-0 bg-tertiary-container/10 blur-3xl w-80 h-80 rounded-full`}
      ></div>
      <div className={`container flex justify-center items-center min-h-dvh`}>
        <NotFoundContent />
      </div>
    </main>
  );
};
export default NotFound;
