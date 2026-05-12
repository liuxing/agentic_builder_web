import { test, expect } from "../fixtures";
import { SEL, getTimerText, getStatusText, getPrimaryButtonLabel } from "../utils";

test.describe("E2E-001 — Load default timer UI in Focus mode", () => {
  test("displays app title, mode toggles, timer, status, and action buttons", async ({
    timerPage: page,
  }) => {
    // Assert key elements are visible
    await expect(page.locator(SEL.appTitle)).toBeVisible();
    await expect(page.locator(SEL.focusToggle)).toBeVisible();
    await expect(page.locator(SEL.breakToggle)).toBeVisible();
    await expect(page.locator(SEL.timerDisplay)).toBeVisible();
    await expect(page.locator(SEL.statusText)).toBeVisible();
    await expect(page.locator(SEL.primaryButton)).toBeVisible();
    await expect(page.locator(SEL.resetButton)).toBeVisible();
  });

  test("shows Focus mode selected and timer at 25:00", async ({
    timerPage: page,
  }) => {
    // Focus toggle should be visually highlighted (assume a CSS class or aria-pressed)
    const focusBtn = page.locator(SEL.focusToggle);
    await expect(focusBtn).toHaveAttribute("aria-pressed", "true");
    // Break toggle should not be highlighted
    await expect(page.locator(SEL.breakToggle)).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    // Timer display
    const timerValue = await getTimerText(page);
    expect(timerValue).toBe("25:00");
  });

  test("initial status indicates ready and primary action is Start", async ({
    timerPage: page,
  }) => {
    const status = await getStatusText(page);
    expect(status).toMatch(/ready|idle/i);
    const primaryLabel = await getPrimaryButtonLabel(page);
    expect(primaryLabel).toMatch(/start/i);
  });
});