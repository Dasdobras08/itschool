import { describe, expect, it } from "vitest";
import { formatCnpj, isValidCnpj, onlyDigits } from "./br";

describe("isValidCnpj", () => {
  it("accepts valid numbers, with or without punctuation", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11222333000181")).toBe(true);
  });

  it("rejects wrong check digits, repeated digits and wrong length", () => {
    expect(isValidCnpj("11.222.333/0001-82")).toBe(false);
    expect(isValidCnpj("00.000.000/0000-00")).toBe(false);
    expect(isValidCnpj("1122233300018")).toBe(false);
  });
});

describe("formatCnpj", () => {
  it("formats digits as a CNPJ", () => {
    expect(formatCnpj("11222333000181")).toBe("11.222.333/0001-81");
    expect(onlyDigits("11.222.333/0001-81")).toBe("11222333000181");
  });
});
