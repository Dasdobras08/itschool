import { NextResponse, type NextRequest } from "next/server";
import { ACTIVE_COOKIE } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

// POST only, so a link or image on another site can't sign people out.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const target = request.nextUrl.clone();
  target.pathname = "/entrar";
  target.search = "";
  const response = NextResponse.redirect(target, { status: 303 });
  response.cookies.delete(ACTIVE_COOKIE);
  return response;
}
