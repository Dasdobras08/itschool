"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink, type LoginState } from "./actions";

const initial: LoginState = { status: "idle" };

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return (
      <div className="space-y-2" role="status">
        <p className="font-medium">Confira seu e-mail</p>
        <p className="text-sm text-muted-foreground">
          Enviamos um link de acesso para <strong>{state.email}</strong>. Abra o e-mail neste
          aparelho e toque no link para entrar.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@escola.com.br"
          defaultValue={state.email}
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "email-error" : undefined}
          required
        />
        {state.status === "error" && (
          <p id="email-error" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enviando…" : "Receber link de acesso"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Sem senha para lembrar: você recebe um link por e-mail a cada acesso.
      </p>
    </form>
  );
}
