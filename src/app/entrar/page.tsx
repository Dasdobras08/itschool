import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { safeNextPath } from "@/lib/routes";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/entrar">) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : undefined);
  const linkError = params.erro === "link";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <Logo />
      <Card className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <CardTitle>Entrar no Itschool</CardTitle>
          <CardDescription>Para escolas, professores e famílias.</CardDescription>
        </div>
        {linkError && (
          <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            Esse link expirou ou já foi usado. Peça um novo abaixo.
          </p>
        )}
        <LoginForm next={next} />
      </Card>
    </main>
  );
}
