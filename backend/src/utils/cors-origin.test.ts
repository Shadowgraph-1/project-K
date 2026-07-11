import { describe, expect, it } from "vitest";

import { isCorsOriginAllowed } from "./cors-origin.js";

const LOCAL_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
] as const;

describe("isCorsOriginAllowed", () => {
  it("allows missing Origin (server-to-server)", () => {
    expect(isCorsOriginAllowed(undefined, LOCAL_ORIGINS, "production")).toBe(
      true,
    );
  });

  it("allows configured origins in production", () => {
    expect(
      isCorsOriginAllowed("http://localhost:4173", LOCAL_ORIGINS, "production"),
    ).toBe(true);
  });

  it("allows any origin in development", () => {
    expect(
      isCorsOriginAllowed(
        "https://random-host.example",
        LOCAL_ORIGINS,
        "development",
      ),
    ).toBe(true);
  });

  it("allows localtunnel origins in production", () => {
    expect(
      isCorsOriginAllowed(
        "https://funny-cat-12.loca.lt",
        LOCAL_ORIGINS,
        "production",
      ),
    ).toBe(true);
  });

  it("blocks unknown origins in production", () => {
    expect(
      isCorsOriginAllowed(
        "https://evil.example.com",
        LOCAL_ORIGINS,
        "production",
      ),
    ).toBe(false);
  });
});