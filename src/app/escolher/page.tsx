import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { accessKey } from "@/lib/access";
import { getAccessList, getCurrentUser } from "@/lib/session";
import { chooseAccess } from "./actions";

export const metadata: Metadata = { title: "Escolher escola" };

const areaLabel = { escola: "Equipe da escola", familia: "Família" } as const;

export default async function ChoosePage() {
  if (!(await getCurrentUser())) redirect("/entrar");
  const list = await getAccessList();
  if (list.length === 0) redirect("/nova-escola");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <Logo href="/inicio" />
      <Card className="w-full max-w-md space-y-5">
        <div className="space-y-1">
          <CardTitle>Onde você quer entrar?</CardTitle>
          <CardDescription>Você pode trocar a qualquer momento pelo menu.</CardDescription>
        </div>
        <form action={chooseAccess} className="space-y-2">
          {list.map((access) => (
            <button
              key={accessKey(access.schoolId, access.area)}
              type="submit"
              name="access"
              value={accessKey(access.schoolId, access.area)}
              className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left hover:bg-muted"
            >
              <span>
                <span className="block font-medium">{access.schoolName}</span>
                <span className="block text-sm text-muted-foreground">{areaLabel[access.area]}</span>
              </span>
              <span aria-hidden>→</span>
            </button>
          ))}
        </form>
        <Link href="/nova-escola" className="block text-sm text-primary underline-offset-4 hover:underline">
          Cadastrar outra escola
        </Link>
      </Card>
    </main>
  );
}
