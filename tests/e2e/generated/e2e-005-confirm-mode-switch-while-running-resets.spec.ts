import { test, expect } from "../fixtures";
import {
  SEL,
  getTimerText,
  getPrimaryButtonLabel,
  clickBreakMode,
  clickPrimaryButton,
} from "../utils";

/**
 * E2E-005 — Confirm mode switch while running resets to new mode default
 *
 * Covered requirement IDs:
 * US-02, FR-MM02, FR-TM02, AC-12
 */

test.describe("E2E-005 — Confirm mode switch while running", () => {
  test("confirming mode switch changes to Break and resets to 05:00", async ({
    timerPage: page,
    clock,
  }) => {
    await clock.install();

    // Start Focus timer and run it down a bit so the dialog is forced.
    await clickPrimaryButton(page);
    await clock.fastForward(7000); // from 25:00 to ~24:53
    const beforeSwitch = await getTimerText(page);
    expect(beforeSwitch).toBe("24:53");

    // Attempt to switch to Break → confirmation dialog
    await clickBreakMode(page);
    const dialog = page.locator(SEL.confirmDialog);
    await expect(dialog).toBeVisible();

    // Click Confirm
    await page.locator(SEL.confirmDialogConfirm).click();

    // Dialog closes
    await expect(dialog).not.toBeVisible();

    // Break mode is now selected
    await expect(page.locator(SEL.breakToggle)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Timer resets to Break default of 05:00
    expect(await getTimerText(page)).toBe("05:00");
    // Timer is idle (button shows Start)
    expect(await getPrimaryButtonLabel(page)).toMatch(/start/i);
  });
});