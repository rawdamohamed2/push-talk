import type { User } from "@/types/index.ts";

interface MembersStripProps {
  members: User[];
  onlineIds: number[];
}

export function MembersStrip({ members, onlineIds }: MembersStripProps) {
  const online = new Set(onlineIds);

  return (
    <div className="flex flex-wrap justify-center items-center sm:gap-1 gap-2">
      {members.map((m) => {
        const isOnline = online.has(m.id);
        return (
          <div
            key={m.id}
            className={` flex items-center rounded-full gap-1.5 bg-slate-800 p-2 text-xs ${
              isOnline ? "text-slate-200" : "text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-400" : "bg-slate-600"}`}
            />
            {m.username}
          </div>
        );
      })}
    </div>
  );
}
