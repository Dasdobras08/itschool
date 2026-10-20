import Link from "next/link";

// Switch school/area and sign out. A plain <details> works without JavaScript.
export function AccountMenu({
  email,
  schoolName,
  canSwitch,
}: {
  email: string | null;
  schoolName: string;
  canSwitch: boolean;
}) {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
        <span className="max-w-40 truncate font-medium">{schoolName}</span>
        <span aria-hidden>▾</span>
      </summary>
      <div className="absolute right-0 z-20 mt-1 w-56 space-y-1 rounded-lg border border-border bg-card p-2 shadow-lg">
        {email && <p className="truncate px-2 py-1 text-xs text-muted-foreground">{email}</p>}
        {canSwitch && (
          <Link href="/escolher" className="block rounded-md px-2 py-1.5 text-sm hover:bg-muted">
            Trocar escola ou perfil
          </Link>
        )}
        <form action="/auth/sair" method="post">
          <button type="submit" className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted">
            Sair
          </button>
        </form>
      </div>
    </details>
  );
}
