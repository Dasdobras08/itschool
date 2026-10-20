"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/routes";

export type LoginState = { status: "idle" | "sent" | "error"; message?: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNextPath(String(formData.get("next") ?? ""));

  if (!EMAIL.test(email)) {
    return { status: "error", message: "Digite um e-mail válido.", email };
  }

  const supabase = await createClient();
  const redirectTo = new URL("/auth/confirm", await siteUrl());
  redirectTo.searchParams.set("next", next);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo.toString(), shouldCreateUser: true },
  });

  if (error) {
    const tooMany = error.status === 429;
    return {
      status: "error",
      email,
      message: tooMany
        ? "Muitas tentativas. Aguarde um minuto e tente de novo."
        : "Não foi possível enviar o link agora. Tente de novo em instantes.",
    };
  }

  return { status: "sent", email };
}
