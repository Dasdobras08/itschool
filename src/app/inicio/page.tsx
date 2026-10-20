import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_COOKIE, homeForArea, pickActive } from "@/lib/access";
import { getAccessList, getCurrentUser } from "@/lib/session";

// After login: send each person to the right place.
export default async function StartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const list = await getAccessList();
  if (list.length === 0) redirect("/nova-escola");

  const saved = (await cookies()).get(ACTIVE_COOKIE)?.value;
  const active = pickActive(list, saved);
  redirect(active ? homeForArea(active.area) : "/escolher");
}
