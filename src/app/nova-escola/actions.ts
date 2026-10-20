"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_COOKIE, accessKey, activeCookieOptions } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export type NewSchoolState = { error?: string; name?: string };

export async function createSchool(_prev: NewSchoolState, formData: FormData): Promise<NewSchoolState> {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    return { error: "O nome deve ter entre 2 e 120 caracteres.", name };
  }

  const supabase = await createClient();
  const { data: schoolId, error } = await supabase.rpc("create_school", { _name: name });
  if (error || typeof schoolId !== "string") {
    const limit = error?.message.includes("school limit reached");
    return {
      error: limit
        ? "Você já cadastrou o número máximo de escolas. Fale com o suporte."
        : "Não foi possível cadastrar a escola agora. Tente de novo.",
      name,
    };
  }

  (await cookies()).set(ACTIVE_COOKIE, accessKey(schoolId, "escola"), activeCookieOptions);
  redirect("/painel");
}
