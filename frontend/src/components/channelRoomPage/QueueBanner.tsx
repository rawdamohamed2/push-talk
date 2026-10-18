const QueueBanner = ({ waiting }: { waiting: number }) => {
  if (waiting === 0) return null;
  return (
    <div
      className="mx-4 mt-2 rounded-lg bg-muted px-4 py-2 text-sm text-secondary"
      role="status"
    >
      Up next: {waiting} message{waiting > 1 ? "s" : ""} waiting
    </div>
  );
};
export default QueueBanner;
