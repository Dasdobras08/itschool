"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, type NavGroup, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu principal" className="space-y-5">
      {groups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted",
                      active && "bg-primary/10 font-medium text-primary",
                    )}
                  >
                    {item.label}
                    {item.step && (
                      <span className="text-[10px] font-medium text-muted-foreground">em breve</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Menu principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map((item) => {
          const active = isActive(item, pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center text-xs",
                  active ? "font-semibold text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
