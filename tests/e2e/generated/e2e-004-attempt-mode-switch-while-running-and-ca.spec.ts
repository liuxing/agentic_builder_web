import { test, expect } from "../fixtures";
import {
  SEL,
  getTimerText,
  clickBreakMode,
  clickPrimaryButton,
} from "../utils";

/**
 * E2E-004 — Attempt mode switch while running and cancel via dialog controls
 *
 * Covered requirement IDs:
 * FR-MM02, AC-12, AC-13
 */

test.describe("E2E-004 — Attempt mode switch while running and cancel", () => {
  test("Cancel button keeps running timer in Focus mode untouched", async ({
    timerPage: page,
    clock,
  }) => {
    await clock.install();

    // Start the Focus timer and let it run for some seconds.
    await clickPrimaryButton(page);
    await clock.fastForward(5000); // 25:00 → 24:55
    const beforeSwitch = await getTimerText(page);
    expect(beforeSwitch).toBe("24:55");

    // Attempt to switch to Break while running → confirmation dialog appears
    await clickBreakMode(page);
    const dialog = page.locator(SEL.confirmDialog);
    await expect(dialog).toBeVisible();
    // Timer value must stay unchanged
    expect(await getTimerText(page)).toBe(beforeSwitch);

    // Click Cancel
    await page.locator(SEL.confirmDialogCancel).click();
    await expect(dialog).not.toBeVisible();

    // Timer continues from the same value (still 24:55) and mode is still Focus
    expect(await getTimerText(page)).toBe(beforeSwitch);
    await expect(page.locator(SEL.focusToggle)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("pressing Escape dismisses the confirmation dialog without changes", async ({
    timerPage: page,
    clock,
  }) => {
    await clock.install();

    await clickPrimaryButton(page);
    await clock.fastForward(5000);
    const beforeSwitch = await getTimerText(page);

    // Open dialog
    await clickBreakMode(page);
    const dialog = page.locator(SEL.confirmDialog);
    await expect(dialog).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // No mode switch, timer unchanged
    expect(await getTimerText(page)).toBe(beforeSwitch);
    await expect(page.locator(SEL.focusToggle)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("clicking outside the dialog (backdrop) dismisses without changes", async ({
    timerPage: page,
    clock,
  }) => {
    await clock.install();

    await clickPrimaryButton(page);
    await clock.fastForward(5000);
    const beforeSwitch = await getTimerText(page);

    // Open dialog
    await clickBreakMode(page);
    const dialog = page.locator(SEL.confirmDialog);
    await expect(dialog).toBeVisible();

    // Click outside the modal — simulate backdrop click.
    // Click on a far-away coordinate that is not inside the dialog.
    await page.mouse.click(10, 10);
    await expect(dialog).not.toBeVisible();

    // Timer unchanged, mode remains Focus
    expect(await getTimerText(page)).toBe(beforeSwitch);
    await expect(page.locator(SEL.focusToggle)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});