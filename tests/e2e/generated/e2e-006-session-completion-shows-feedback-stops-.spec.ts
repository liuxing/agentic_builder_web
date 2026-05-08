import { test, expect } from "../fixtures";
import {
  SEL,
  getTimerText,
  clickPrimaryButton,
} from "../utils";

/**
 * E2E-006 — Session completion shows feedback, stops at zero, and can be dismissed
 *
 * Covered requirement IDs:
 * US-05, FR-TM07, FR-AF01, FR-AF02, FR-AF03, AC-08, AC-09, AC-16
 */

// Override HTMLMediaElement.prototype.play so we can spy on call count
// without triggering real audio in headless tests.
async function installAudioSpy(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    (window as any).__audioPlayCount = 0;
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      (window as any).__audioPlayCount++;
      // Return a resolved promise to avoid unhandled rejections.
      return Promise.resolve();
    };
  });
}

async function getPlayCount(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate(() => (window as any).__audioPlayCount ?? 0);
}

const FOCUS_DURATION_MS = 25 * 60 * 1000; // 25 minutes in ms

test.describe("E2E-006 — Session completion", () => {
  test("completes at 00:00, shows focus message, plays sound once", async ({
    page,
    clock,
  }) => {
    // Install audio spy BEFORE the page loads any audio elements.
    await installAudioSpy(page);
    await page.goto("/");
    await page.waitForSelector(SEL.timerDisplay, {
      state: "visible",
      timeout: 10_000,
    });

    await clock.install();

    // Start the Focus timer
    await clickPrimaryButton(page);

    // Fast-forward the full 25-minute duration
    await clock.fastForward(FOCUS_DURATION_MS);

    // Timer must stop at 00:00 and never show negative numbers
    expect(await getTimerText(page)).toBe("00:00");

    // Completion banner is visible
    const banner = page.locator(SEL.completionBanner);
    await expect(banner).toBeVisible();
    // Message includes the mode name (Focus)
    await expect(page.locator(SEL.completionTitle)).toContainText(/focus/i, {
      ignoreCase: true,
    });

    // Sound was triggered exactly once
    expect(await getPlayCount(page)).toBe(1);
  });

  test("dismisses completion feedback with button", async ({
    page,
    clock,
  }) => {
    await installAudioSpy(page);
    await page.goto("/");
    await page.waitForSelector(SEL.timerDisplay, {
      state: "visible",
      timeout: 10_000,
    });
    await clock.install();

    await clickPrimaryButton(page);
    await clock.fastForward(FOCUS_DURATION_MS);

    const banner = page.locator(SEL.completionBanner);
    await expect(banner).toBeVisible();

    // Click dismiss
    await page.locator(SEL.dismissCompletion).click();
    await expect(banner).not.toBeVisible();
  });

  test("dismisses completion feedback with Escape key", async ({
    page,
    clock,
  }) => {
    await installAudioSpy(page);
    await page.goto("/");
    await page.waitForSelector(SEL.timerDisplay, {
      state: "visible",
      timeout: 10_000,
    });
    await clock.install();

    await clickPrimaryButton(page);
    await clock.fastForward(FOCUS_DURATION_MS);

    const banner = page.locator(SEL.completionBanner);
    await expect(banner).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");
    await expect(banner).not.toBeVisible();
  });

  test("audio playback failure still shows completion feedback", async ({
    page,
    clock,
  }) => {
    // Override play to reject (simulate failure)
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
        return Promise.reject(new Error("NotAllowedError"));
      };
    });

    await page.goto("/");
    await page.waitForSelector(SEL.timerDisplay, {
      state: "visible",
      timeout: 10_000,
    });
    await clock.install();

    await clickPrimaryButton(page);
    await clock.fastForward(FOCUS_DURATION_MS);

    // Timer still reaches 00:00
    expect(await getTimerText(page)).toBe("00:00");

    // Completion banner appears despite audio failure
    const banner = page.locator(SEL.completionBanner);
    await expect(banner).toBeVisible();

    // UI remains usable: we can dismiss and start a new session
    await page.locator(SEL.dismissCompletion).click();
    await expect(banner).not.toBeVisible();

    // Start a new session (timer should be back to 25:00, reset)
    expect(await getTimerText(page)).toBe("25:00");
    await clickPrimaryButton(page);
    await clock.fastForward(2000);
    expect(await getTimerText(page)).toBe("24:58");
  });
});