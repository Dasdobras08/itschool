import { describe, expect, it } from "vitest";
import { isProtectedPath, safeNextPath } from "./routes";

describe("isProtectedPath", () => {
  it("protects private areas", () => {
    expect(isProtectedPath("/painel")).toBe(true);
    expect(isProtectedPath("/painel/alunos")).toBe(true);
    expect(isProtectedPath("/familia")).toBe(true);
    expect(isProtectedPath("/inicio")).toBe(true);
  });

  it("leaves public pages open", () => {
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/entrar")).toBe(false);
    expect(isProtectedPath("/painelzinho")).toBe(false);
  });
});

describe("safeNextPath", () => {
  it("keeps paths inside the app", () => {
    expect(safeNextPath("/painel/alunos")).toBe("/painel/alunos");
  });

  it("rejects other sites and odd input", () => {
    expect(safeNextPath("https://evil.example")).toBe("/inicio");
    expect(safeNextPath("//evil.example")).toBe("/inicio");
    expect(safeNextPath("/\\evil.example")).toBe("/inicio");
    expect(safeNextPath(null)).toBe("/inicio");
    expect(safeNextPath("")).toBe("/inicio");
  });
});
