import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireArea } from "@/lib/session";

export const metadata: Metadata = { title: "Início" };

export default async function FamilyHomePage() {
  const { active } = await requireArea("familia");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Olá!</h1>
      <Card>
        <CardTitle>Tudo em dia</CardTitle>
        <CardDescription className="mt-1">
          Aqui vão aparecer as mensalidades, os avisos e os eventos da {active.schoolName} que
          precisam da sua atenção.
        </CardDescription>
      </Card>
    </div>
  );
}
