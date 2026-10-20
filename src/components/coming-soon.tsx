import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const stepNames: Record<number, string> = {
  2: "cadastros",
  3: "mensalidades",
  4: "Pix e boleto",
  5: "comunicação e portal dos pais",
  6: "relatórios e assinatura",
};

export function ComingSoon({ title, step }: { title: string; step?: number }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Card>
        <CardTitle>Em construção</CardTitle>
        <CardDescription className="mt-1">
          {step
            ? `Esta tela chega na etapa ${step} (${stepNames[step] ?? "próximas etapas"}).`
            : "Esta tela chega nas próximas etapas."}
        </CardDescription>
      </Card>
    </div>
  );
}
