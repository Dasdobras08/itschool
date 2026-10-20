import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold">
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        it
      </span>
      Itschool
    </Link>
  );
}
