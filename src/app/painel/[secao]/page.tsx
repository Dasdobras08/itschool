import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
import { findNavItem } from "@/lib/navigation";
import { requireArea } from "@/lib/session";

export default async function SchoolSectionPage({ params }: PageProps<"/painel/[secao]">) {
  const { secao } = await params;
  const item = findNavItem(`/painel/${secao}`);
  if (!item?.step || !item.href.startsWith("/painel/")) notFound();

  const { active } = await requireArea("escola");
  if (!item.roles.some((role) => active.roles.includes(role))) notFound();

  return <ComingSoon title={item.label} step={item.step} />;
}
