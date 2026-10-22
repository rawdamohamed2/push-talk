import { Badge } from "@/components/ui/badge";
const ChannelSection = () => {
  return (
    <section
      className={`bg-muted rounded-lg 
        shadow-sm p-8 overflow-hidden 
        relative isolate
        before:content-['']
        before:absolute before:-z-30
        before:top-[-16] before:end-0
        before:w-100 before:h-40
        before:rounded-full
        before:bg-radial
        before:from-secondary/20
        before:from-40%
        before:to-fuchsia-700/0
        before:blur-2xl
    `}
    >
      <div className={`flex flex-col gap-3`}>
        <div className={`flex md:flex-row flex-col gap-3 items-center`}>
          <Badge>SPECTRUM 2.4 GHZ</Badge>
          <div className={`flex gap-2 items-center`}>
            <span
              className={`inline-block w-2 h-2 rounded-full bg-secondary`}
            ></span>
            <p className={`text-[11px] font-medium uppercase`}>
              42.8 KB/S NETWORK LOAD
            </p>
          </div>
        </div>
        <h1 className={`text-4xl font-bold leading-[40px] tracking-[-0.8px]`}>
          Channels & Frequencies
        </h1>
        <p className={`text-sm text-muted-foreground max-w-[648px]`}>
          Browse, tune in, and join active team voice channels and synchronized
          broadcast streams with real-time waveform inspection.
        </p>
      </div>
    </section>
  );
};
export default ChannelSection;
