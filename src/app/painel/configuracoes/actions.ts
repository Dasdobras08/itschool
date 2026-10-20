"use server";

import { revalidatePath } from "next/cache";
import { isValidCnpj, onlyDigits } from "@/lib/br";
import { requireArea } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export type SchoolFormState = {
  status: "idle" | "saved" | "error";
  errors?: Partial<Record<"name" | "legal_name" | "cnpj" | "form", string>>;
};

export async function saveSchool(_prev: SchoolFormState, formData: FormData): Promise<SchoolFormState> {
  const { active } = await requireArea("escola");
  if (!active.roles.includes("admin")) {
    return { status: "error", errors: { form: "Só a administração da escola pode alterar estes dados." } };
  }

  const name = String(formData.get("name") ?? "").trim();
  const legalName = String(formData.get("legal_name") ?? "").trim();
  const cnpjInput = String(formData.get("cnpj") ?? "").trim();
  const cnpj = onlyDigits(cnpjInput);

  const errors: SchoolFormState["errors"] = {};
  if (name.length < 2 || name.length > 120) errors.name = "O nome deve ter entre 2 e 120 caracteres.";
  if (legalName.length > 200) errors.legal_name = "A razão social pode ter até 200 caracteres.";
  if (cnpjInput && !isValidCnpj(cnpj)) errors.cnpj = "CNPJ inválido. Confira os números.";
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .update({ name, legal_name: legalName || null, cnpj: cnpj || null })
    .eq("id", active.schoolId)
    .select("id");

  if (error || !data?.length) {
    return { status: "error", errors: { form: "Não foi possível salvar agora. Tente de novo." } };
  }

  revalidatePath("/painel", "layout");
  return { status: "saved" };
}
