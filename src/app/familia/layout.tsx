import { Logo } from "@/components/logo";
import { AccountMenu } from "@/components/shell/account-menu";
import { BottomNav } from "@/components/shell/nav-links";
import { familyNav } from "@/lib/navigation";
import { requireArea } from "@/lib/session";

export default async function FamilyLayout({ children }: LayoutProps<"/familia">) {
  const { user, active, hasOtherOptions } = await requireArea("familia");

  return (
    <div className="flex min-h-full flex-1 flex-col pb-20">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <Logo href="/familia" />
        <AccountMenu email={user.email} schoolName={active.schoolName} canSwitch={hasOtherOptions} />
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">{children}</main>
      <BottomNav items={familyNav} />
    </div>
  );
}
