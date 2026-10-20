import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireArea } from "@/lib/session";

export const metadata: Metadata = { title: "Painel" };

const firstSteps = [
  { title: "Cadastrar turmas e alunos", text: "Importe sua lista de alunos por planilha.", step: 2 },
  { title: "Convidar as famílias", text: "Cada responsável recebe um convite por e-mail.", step: 2 },
  { title: "Criar o plano de mensalidade", text: "Valor, vencimento, desconto, multa e juros.", step: 3 },
  { title: "Ativar Pix e boleto", text: "Cobranças com baixa automática.", step: 4 },
  { title: "Publicar o primeiro aviso", text: "Com confirmação de leitura.", step: 5 },
];

export default async function DashboardPage() {
  const { active } = await requireArea("escola");
  const isAdmin = active.roles.includes("admin");

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Olá! Este é o painel da {active.schoolName}.</h1>
        <p className="text-muted-foreground">
          Os números de mensalidades e avisos aparecem aqui assim que a escola começar a usar.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="space-y-1">
          <CardTitle>Primeiros passos</CardTitle>
          <CardDescription>O que vem a seguir para deixar a escola pronta.</CardDescription>
        </div>
        <ol className="space-y-3">
          {firstSteps.map((item, index) => (
            <li key={item.title} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
                {index + 1}
              </span>
              <span>
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {item.text} Disponível na etapa {item.step}.
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      {isAdmin && (
        <p className="text-sm text-muted-foreground">
          Já dá para completar os{" "}
          <Link href="/painel/configuracoes" className="text-primary underline-offset-4 hover:underline">
            dados da escola
          </Link>
          .
        </p>
      )}
    </div>
  );
}
