import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireArea } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { SchoolForm } from "./school-form";

export const metadata: Metadata = { title: "Dados da escola" };

export default async function SettingsPage() {
  const { active } = await requireArea("escola");
  if (!active.roles.includes("admin")) notFound();

  const supabase = await createClient();
  const { data: school, error } = await supabase
    .from("schools")
    .select("name, legal_name, cnpj")
    .eq("id", active.schoolId)
    .single();
  if (error || !school) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dados da escola</h1>
      <Card className="max-w-xl space-y-5">
        <div className="space-y-1">
          <CardTitle>Identificação</CardTitle>
          <CardDescription>Esses dados aparecem nos boletos, no Pix e nos comprovantes.</CardDescription>
        </div>
        <SchoolForm school={school} />
      </Card>
    </div>
  );
}
