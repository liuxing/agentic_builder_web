import { test, expect } from "../fixtures";
import {
  SEL,
  getTimerText,
  getStatusText,
  getPrimaryButtonLabel,
  clickBreakMode,
  clickFocusMode,
  clickPrimaryButton,
  clickResetButton,
} from "../utils";

test.describe("E2E-002 — Switch modes while idle and preserve selected mode on reset", () => {
  test("Break mode updates timer to 05:00 and highlights Break", async ({
    timerPage: page,
  }) => {
    // Default is Focus (confirmed by E2E-001). Click Break.
    await clickBreakMode(page);
    // Break should now be highlighted
    await expect(page.locator(SEL.breakToggle)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator(SEL.focusToggle)).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    // Timer updates to 05:00
    const timerValue = await getTimerText(page);
    expect(timerValue).toBe("05:00");
  });

  test("reset in Break mode returns timer to 05:00 and stays in Break", async ({
    timerPage: page,
  }) => {
    // 1. Switch to Break mode
    await clickBreakMode(page);
    // 2. Start the timer (to change state)
    await clickPrimaryButton(page);
    // 3. Reset – should stop and reset to 05:00, still Break mode
    await clickResetButton(page);
    const timerValue = await getTimerText(page);
    expect(timerValue).toBe("05:00");
    const status = await getStatusText(page);
    expect(status).toMatch(/ready|idle/i);
    // Mode remains Break (highlighted)
    await expect(page.locator(SEL.breakToggle)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("switch back to Focus resets timer to 25:00", async ({
    timerPage: page,
  }) => {
    // Start in Break mode first to be sure
    await clickBreakMode(page);
    // Now click Focus
    await clickFocusMode(page);
    await expect(page.locator(SEL.focusToggle)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const timerValue = await getTimerText(page);
    expect(timerValue).toBe("25:00");
  });
});