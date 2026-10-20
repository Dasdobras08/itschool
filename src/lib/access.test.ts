import { describe, expect, it } from "vitest";
import { groupAccess, pickActive, type MembershipRow } from "./access";

const rows: MembershipRow[] = [
  { school_id: "s1", role: "admin", schools: { name: "Colégio Sol" } },
  { school_id: "s1", role: "teacher", schools: { name: "Colégio Sol" } },
  { school_id: "s1", role: "guardian", schools: { name: "Colégio Sol" } },
  { school_id: "s2", role: "guardian", schools: { name: "Escola Arco-Íris" } },
];

describe("groupAccess", () => {
  it("groups roles by school and area", () => {
    expect(groupAccess(rows)).toEqual([
      { schoolId: "s1", schoolName: "Colégio Sol", area: "escola", roles: ["admin", "teacher"] },
      { schoolId: "s1", schoolName: "Colégio Sol", area: "familia", roles: ["guardian"] },
      { schoolId: "s2", schoolName: "Escola Arco-Íris", area: "familia", roles: ["guardian"] },
    ]);
  });
});

describe("pickActive", () => {
  const list = groupAccess(rows);

  it("uses the saved choice when it is still valid", () => {
    expect(pickActive(list, "s2:familia")?.schoolId).toBe("s2");
  });

  it("ignores a saved choice the person no longer has", () => {
    expect(pickActive(list, "s9:escola")).toBeUndefined();
  });

  it("picks the only option of an area", () => {
    expect(pickActive(list, undefined, "escola")?.schoolId).toBe("s1");
  });

  it("asks to choose when there are several options", () => {
    expect(pickActive(list, undefined, "familia")).toBeUndefined();
    expect(pickActive(list, undefined)).toBeUndefined();
  });
});
