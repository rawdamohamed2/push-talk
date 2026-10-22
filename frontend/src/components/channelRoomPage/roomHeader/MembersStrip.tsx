import type { User } from "@/types/index.ts";

interface MembersStripProps {
  members: User[];
  onlineIds: number[];
}

export function MembersStrip({ onlineIds, members }: MembersStripProps) {
  return (
    <div className="flex flex-wrap justify-center items-center sm:gap-1 gap-2">
      {members.map((m) => {
        const isOnline = onlineIds.includes(m.id);
        return (
          <div
            key={m.id}
            className={` flex items-center rounded-full gap-1.5 bg-slate-800 p-2 text-xs ${isOnline ? "text-slate-100" : "text-slate-400"}
            `}
          >
            <span
              className={`h-2 w-2 rounded-full ${isOnline ? "bg-secondary" : "bg-slate-600"} `}
            />
            {m.username}
          </div>
        );
      })}
    </div>
  );
}
