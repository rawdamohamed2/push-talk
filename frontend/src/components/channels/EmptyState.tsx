import logo from "@/assets/logo.webp";

const EmptyState = () => {
  return (
    <section className={``}>
      <div className={`container flex flex-col gap-4 py-3`}>
        {/*<div className={`flex justify-center items-center`}>*/}
        {/*  <img*/}
        {/*    src={logo}*/}
        {/*    alt="push talk logo"*/}
        {/*    className={`w-[120px] h-[120px]`}*/}
        {/*  />*/}
        {/*</div>*/}
        <h2 className={`text-center text-4xl font-bold`}>No Channels Found</h2>
      </div>
    </section>
  );
};
export default EmptyState;
