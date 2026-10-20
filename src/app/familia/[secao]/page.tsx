import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
import { findNavItem } from "@/lib/navigation";

export default async function FamilySectionPage({ params }: PageProps<"/familia/[secao]">) {
  const { secao } = await params;
  const item = findNavItem(`/familia/${secao}`);
  if (!item?.step || !item.href.startsWith("/familia/")) notFound();
  return <ComingSoon title={item.label} step={item.step} />;
}
