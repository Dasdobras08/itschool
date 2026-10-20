// Pure helpers about who can enter which area of which school.

export type MemberRole = "admin" | "teacher" | "guardian";
export type Area = "escola" | "familia";

export type MembershipRow = {
  school_id: string;
  role: MemberRole;
  schools: { name: string } | null;
};

export type SchoolAccess = {
  schoolId: string;
  schoolName: string;
  area: Area;
  roles: MemberRole[];
};

export const ACTIVE_COOKIE = "itschool_ativo";

export const activeCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
} as const;

export function areaForRole(role: MemberRole): Area {
  return role === "guardian" ? "familia" : "escola";
}

export function homeForArea(area: Area) {
  return area === "escola" ? "/painel" : "/familia";
}

/** One entry per (school, area), with every role the person has there. */
export function groupAccess(rows: MembershipRow[]): SchoolAccess[] {
  const byKey = new Map<string, SchoolAccess>();
  for (const row of rows) {
    const area = areaForRole(row.role);
    const key = accessKey(row.school_id, area);
    const entry = byKey.get(key) ?? {
      schoolId: row.school_id,
      schoolName: row.schools?.name ?? "Escola",
      area,
      roles: [],
    };
    if (!entry.roles.includes(row.role)) entry.roles.push(row.role);
    byKey.set(key, entry);
  }
  return [...byKey.values()].sort(
    (a, b) => a.schoolName.localeCompare(b.schoolName, "pt-BR") || a.area.localeCompare(b.area),
  );
}

export function accessKey(schoolId: string, area: Area) {
  return `${schoolId}:${area}`;
}

/**
 * Picks the school and area to show: the one saved in the cookie if it is
 * still valid, or the only option when there is just one.
 */
export function pickActive(
  list: SchoolAccess[],
  cookieValue: string | undefined,
  area?: Area,
): SchoolAccess | undefined {
  const options = area ? list.filter((a) => a.area === area) : list;
  const saved = options.find((a) => accessKey(a.schoolId, a.area) === cookieValue);
  if (saved) return saved;
  return options.length === 1 ? options[0] : undefined;
}
