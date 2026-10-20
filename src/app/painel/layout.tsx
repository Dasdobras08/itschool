import { Logo } from "@/components/logo";
import { AccountMenu } from "@/components/shell/account-menu";
import { SidebarNav } from "@/components/shell/nav-links";
import { navForRoles, schoolNav } from "@/lib/navigation";
import { requireArea } from "@/lib/session";

export default async function SchoolLayout({ children }: LayoutProps<"/painel">) {
  const { user, active, hasOtherOptions } = await requireArea("escola");
  const groups = navForRoles(schoolNav, active.roles);

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card p-4 md:block">
        <div className="mb-6 px-3">
          <Logo href="/painel" />
        </div>
        <SidebarNav groups={groups} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-border bg-card px-4 py-2">
          <details className="md:hidden">
            <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
              ☰ Menu
            </summary>
            <div className="absolute inset-x-0 z-20 mt-2 border-b border-border bg-card p-4 shadow-lg">
              <SidebarNav groups={groups} />
            </div>
          </details>
          <span className="hidden md:block" />
          <AccountMenu email={user.email} schoolName={active.schoolName} canSwitch={hasOtherOptions} />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
