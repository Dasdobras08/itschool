import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_COOKIE,
  groupAccess,
  pickActive,
  type Area,
  type MembershipRow,
  type SchoolAccess,
} from "@/lib/access";

export type CurrentUser = { id: string; email: string | null };

/** The signed-in person, or null. Read once per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
});

/** Every school and area the signed-in person can enter. */
export const getAccessList = cache(async (): Promise<SchoolAccess[]> => {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("school_id, role, schools(name)")
    .eq("user_id", user.id);
  if (error) throw new Error(`Erro ao carregar escolas: ${error.message}`);
  return groupAccess((data ?? []) as unknown as MembershipRow[]);
});

/**
 * For pages inside an area: returns the person and the active school,
 * or sends them to log in or to choose a school.
 */
export async function requireArea(area: Area) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const list = await getAccessList();
  const saved = (await cookies()).get(ACTIVE_COOKIE)?.value;
  const active = pickActive(list, saved, area);
  if (!active) redirect(list.length === 0 ? "/inicio" : "/escolher");

  return { user, active, hasOtherOptions: list.length > 1 };
}
