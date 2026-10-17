import logo from "@/assets/screen.webp";

const FromHeading = () => {
  return (
    <section
      className="
        relative isolate md:w-md w-full text-center
        flex flex-col justify-center items-center
        gap-2
        before:content-['']
        before:absolute before:-z-30
        before:top-[-16] before:left-1/2
        before:-translate-x-1/2
        before:w-80 before:h-60
        before:rounded-full
        before:bg-radial
        before:from-[#C0C1FF]/20
        before:from-40%
        before:to-fuchsia-700/0
        before:blur-2xl
      "
    >
      <div className="w-[160px] h-[160px]">
        <img
          src={logo}
          alt="PushTalk logo"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <h1 className="text-2xl font-semibold">PushTalk</h1>

      <p className="text-xs text-secondary">HOLD. SPEAK. RELEASE.</p>
    </section>
  );
};

export default FromHeading;
