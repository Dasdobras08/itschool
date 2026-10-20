import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { NewSchoolForm } from "./new-school-form";

export const metadata: Metadata = { title: "Cadastrar escola" };

export default async function NewSchoolPage() {
  if (!(await getCurrentUser())) redirect("/entrar");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <Logo href="/inicio" />
      <Card className="w-full max-w-md space-y-5">
        <div className="space-y-1">
          <CardTitle>Cadastre sua escola</CardTitle>
          <CardDescription>
            Você será a pessoa administradora. Depois convide a equipe e as famílias.
          </CardDescription>
        </div>
        <NewSchoolForm />
        <p className="text-xs text-muted-foreground">
          É pai, mãe ou responsável? Peça o convite à secretaria da escola do seu filho.
        </p>
      </Card>
    </main>
  );
}
