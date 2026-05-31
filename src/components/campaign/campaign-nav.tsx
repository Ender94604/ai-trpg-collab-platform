"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type CampaignNavProps = {
  campaignId: string;
};

const navItems = [
  { label: "Overview", segment: "", path: "" },
  { label: "Characters", segment: "characters", path: "/characters" },
  { label: "Sessions", segment: "sessions", path: "/sessions" },
  { label: "AI Assistant", segment: "ai", path: "/ai" },
  { label: "Settings", segment: "settings", path: "/settings" },
];

export function CampaignNav({ campaignId }: CampaignNavProps) {
  const pathname = usePathname();
  const basePath = `/campaigns/${campaignId}`;
  const activeSegment = pathname.slice(basePath.length).split("/")[1] ?? "";

  return (
    <nav
      aria-label="Campaign navigation"
      className="flex gap-2 overflow-x-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-sm"
    >
      {navItems.map((item) => {
        const isActive = activeSegment === item.segment;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={[
              "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
            ].join(" ")}
            href={`${basePath}${item.path}`}
            key={item.label}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
