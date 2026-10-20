import { describe, expect, it } from "vitest";
import { familyNav, findNavItem, isActive, navForRoles, schoolNav } from "./navigation";

describe("navForRoles", () => {
  it("shows every group to an admin", () => {
    const groups = navForRoles(schoolNav, ["admin"]);
    expect(groups.map((g) => g.label)).toEqual([
      "Início",
      "Financeiro",
      "Escola",
      "Comunicação",
      "Configurações",
    ]);
  });

  it("hides finance and settings from teachers", () => {
    const groups = navForRoles(schoolNav, ["teacher"]);
    expect(groups.map((g) => g.label)).toEqual(["Início", "Escola", "Comunicação"]);
    const labels = groups.flatMap((g) => g.items.map((i) => i.label));
    expect(labels).not.toContain("Responsáveis");
    expect(labels).not.toContain("Mensalidades");
  });

  it("shows nothing of the school area to guardians", () => {
    expect(navForRoles(schoolNav, ["guardian"])).toEqual([]);
  });
});

describe("findNavItem", () => {
  it("finds school and family pages", () => {
    expect(findNavItem("/painel/alunos")?.step).toBe(2);
    expect(findNavItem("/familia/avisos")?.label).toBe("Avisos");
    expect(findNavItem("/painel/nao-existe")).toBeUndefined();
  });
});

describe("isActive", () => {
  const painel = findNavItem("/painel")!;
  const alunos = findNavItem("/painel/alunos")!;

  it("matches the dashboard only on its own path", () => {
    expect(isActive(painel, "/painel")).toBe(true);
    expect(isActive(painel, "/painel/alunos")).toBe(false);
  });

  it("matches sub-pages of a section", () => {
    expect(isActive(alunos, "/painel/alunos")).toBe(true);
    expect(isActive(alunos, "/painel/alunos/123")).toBe(true);
    expect(isActive(alunos, "/painel/alunos-antigos")).toBe(false);
  });

  it("keeps the family menu to four tabs", () => {
    expect(familyNav).toHaveLength(4);
  });
});
