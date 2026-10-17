import { type ConnectionStatus, STYLES } from "@/types";
import { Badge } from "@/components/ui/badge.tsx";

const ConnectionBadge = ({ status }: { status: ConnectionStatus }) => {
  const s = STYLES[status];

  return (
    <Badge>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${s.text}`}
      >
        {s.label}
      </span>
    </Badge>
  );
};
export default ConnectionBadge;
