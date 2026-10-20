"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_COOKIE, accessKey, activeCookieOptions, homeForArea } from "@/lib/access";
import { getAccessList } from "@/lib/session";

export async function chooseAccess(formData: FormData) {
  const key = String(formData.get("access") ?? "");
  const list = await getAccessList();
  const chosen = list.find((a) => accessKey(a.schoolId, a.area) === key);
  if (!chosen) redirect("/escolher");

  (await cookies()).set(ACTIVE_COOKIE, key, activeCookieOptions);
  redirect(homeForArea(chosen.area));
}
