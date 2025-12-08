import { describe, expect, it, beforeAll } from "bun:test";

const BASE_URL = "http://localhost:3000";

describe("Windows Explorer API E2E", () => {
  it("should return folder tree structure", async () => {
    const response = await fetch(`${BASE_URL}/folders`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("name");
    expect(data[0]).toHaveProperty("children");
  });

  it("should support search functionality", async () => {
    const response = await fetch(`${BASE_URL}/folders?q=Desktop`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    // Should find at least "Desktop" folder and maybe subfolders
    const hasDesktop = data.some((item: any) => item.name.includes("Desktop"));
    expect(hasDesktop).toBe(true);
  });
});
