"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCnpj } from "@/lib/br";
import { saveSchool, type SchoolFormState } from "./actions";

type School = { name: string; legal_name: string | null; cnpj: string | null };

function Field({
  id,
  label,
  error,
  ...props
}: { id: string; label: string; error?: string } & React.ComponentProps<"input">) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function SchoolForm({ school }: { school: School }) {
  const [state, action, pending] = useActionState(saveSchool, { status: "idle" } as SchoolFormState);

  return (
    <form action={action} className="space-y-4">
      <Field id="name" label="Nome da escola" defaultValue={school.name} required maxLength={120} error={state.errors?.name} />
      <Field
        id="legal_name"
        label="Razão social"
        defaultValue={school.legal_name ?? ""}
        maxLength={200}
        error={state.errors?.legal_name}
      />
      <Field
        id="cnpj"
        label="CNPJ da mantenedora"
        defaultValue={school.cnpj ? formatCnpj(school.cnpj) : ""}
        inputMode="numeric"
        placeholder="00.000.000/0000-00"
        error={state.errors?.cnpj}
      />
      {state.errors?.form && <p className="text-sm text-destructive">{state.errors.form}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar"}
        </Button>
        {state.status === "saved" && (
          <p className="text-sm text-success" role="status">
            Dados salvos.
          </p>
        )}
      </div>
    </form>
  );
}
