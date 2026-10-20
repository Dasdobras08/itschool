import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

const features = [
  {
    title: "Mensalidades automáticas",
    text: "Cobranças geradas todo mês com desconto, bolsa, multa e juros aplicados.",
  },
  {
    title: "Pix e boleto",
    text: "Cada família paga pelo celular e a baixa acontece sozinha.",
  },
  {
    title: "Mural com confirmação de leitura",
    text: "Avisos que chegam no celular, com a lista de quem já leu.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <Link href="/entrar" className={buttonVariants({ size: "sm" })}>
          Entrar
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12">
        <section className="max-w-2xl space-y-5">
          <p className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium">
            Feito para escolas pequenas e médias
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Mensalidades no controle. Comunicação sem ruído.
          </h1>
          <p className="text-lg text-muted-foreground">
            Cobrança recorrente, lembretes e mural de avisos em um só lugar, para a secretaria e
            para as famílias.
          </p>
          <Link href="/entrar" className={buttonVariants({ size: "lg" })}>
            Começar grátis
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Itschool · Feito para escolas do Brasil
      </footer>
    </div>
  );
}
