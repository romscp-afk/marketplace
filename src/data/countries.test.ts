import { describe, it, expect } from "vitest";
import {
  getDialCodeForCountry,
  getPhoneCodeSelectOptions,
  phoneCountryCodes,
} from "@/data/countries";

describe("phone country codes", () => {
  it("assigns correct codes for representative countries", () => {
    expect(getDialCodeForCountry("SG")).toBe("+65");
    expect(getDialCodeForCountry("US")).toBe("+1");
    expect(getDialCodeForCountry("GB")).toBe("+44");
    expect(getDialCodeForCountry("AU")).toBe("+61");
  });

  it("does not default unknown countries to Singapore +65", () => {
    const unknown = phoneCountryCodes.find((c) => c.countryCode === "ZZ");
    expect(unknown).toBeUndefined();
  });

  it("deduplicates shared dial codes in the selector", () => {
    const options = getPhoneCodeSelectOptions("SG");
    const values = options.map((o) => o.value);
    expect(new Set(values).size).toBe(values.length);
    expect(values).toContain("+65");
    expect(values).toContain("+1");
  });

  it("South Sudan uses +211 not +65", () => {
    expect(getDialCodeForCountry("SS")).toBe("+211");
  });
});
