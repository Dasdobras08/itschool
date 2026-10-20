"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSchool, type NewSchoolState } from "./actions";

export function NewSchoolForm() {
  const [state, action, pending] = useActionState(createSchool, {} as NewSchoolState);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da escola</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex.: Colégio Pequeno Príncipe"
          defaultValue={state.name}
          minLength={2}
          maxLength={120}
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "name-error" : undefined}
          required
        />
        {state.error && (
          <p id="name-error" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Cadastrando…" : "Cadastrar escola"}
      </Button>
    </form>
  );
}
