import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">O endereço pode estar errado ou você não tem acesso a esta página.</p>
      <Link href="/inicio" className={buttonVariants({ variant: "outline" })}>
        Voltar ao início
      </Link>
    </main>
  );
}
