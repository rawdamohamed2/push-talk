const Banner = () => {
  return (
    <div className={`bg-surface-container-lowest p-2 flex items-center gap-2`}>
      <p
        className={`text-[10px] font-heading text-secondary font-semibold leading-[12px] tracking-[0.4px]`}
      >
        HQ OPUS AUDIO
      </p>
      <span
        className={`text-[12px] font-heading text-muted-foreground font-semibold leading-[12px] tracking-[0.4px]`}
      >
        /
      </span>
      <p
        className={`text-[10px] font-heading text-muted-foreground font-semibold leading-[12px] tracking-[0.4px]`}
      >
        48.0 kHz 128kbps
      </p>
      <span
        className={`text-[12px] font-heading text-muted-foreground font-semibold leading-[12px] tracking-[0.4px]`}
      >
        /
      </span>
      <p
        className={`text-[10px] font-heading text-secondary font-semibold leading-[12px] tracking-[0.4px] flex gap-1 items-center`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 bg-secondary rounded-full`}
        ></span>
        18ms latency
      </p>
    </div>
  );
};
export default Banner;
