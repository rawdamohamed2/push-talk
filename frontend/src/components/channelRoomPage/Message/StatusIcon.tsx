import { Check, CheckCheck } from "lucide-react";
import type { DeliveryStatus as Status } from "@/types";

const CONFIG = {
  sent: { Icon: Check, label: "Sent", className: "text-muted-foreground" },
  delivered: {
    Icon: CheckCheck,
    label: "Delivered",
    className: "text-muted-foreground",
  },
  played: {
    Icon: CheckCheck,
    label: "Played",
    className: "text-secondary",
  },
} as const;
const StatusIcon = ({ status }: { status: Status }) => {
  const { Icon, label, className } = CONFIG[status];
  return (
    <span
      className={`flex items-center justify-end gap-1 text-xs ${className}`}
      title={label}
    >
      <Icon className="size-4" />
      {label}
    </span>
  );
};
export default StatusIcon;
