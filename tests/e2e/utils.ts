import type { Locator, Page } from "@playwright/test";
import { expect } from "./fixtures";

export const SEL = {
  timerDisplay: '[data-testid="timer-display"]',
  statusText: '[data-testid="timer-status"]',
  primaryButton: '[data-testid="timer-primary-btn"]',
  resetButton: '[data-testid="timer-reset-btn"]',
  focusToggle: '[data-testid="mode-focus"]',
  breakToggle: '[data-testid="mode-break"]',
  completionBanner: '[data-testid="completion-banner"]',
  completionTitle: '[data-testid="completion-title"]',
  dismissCompletion: '[data-testid="dismiss-completion"]',
  confirmDialog: '[data-testid="mode-switch-dialog"]',
  confirmDialogConfirm: '[data-testid="mode-switch-confirm"]',
  confirmDialogCancel: '[data-testid="mode-switch-cancel"]',
  appTitle: '[data-testid="app-title"]',
  errorHeading: '[data-testid="error-heading"]',
  errorRetry: '[data-testid="error-retry"]',
  errorBackToTimer: '[data-testid="error-back-to-timer"]',
} as const;

/** Parse `MM:SS` text to total seconds. */
export function parseTimerValue(text: string): number {
  const match = text.trim().match(/^(\d{1,2}):([0-5]\d)$/);
  if (!match) throw new Error(`Invalid timer format: "${text}"`);
  return Number(match[1]) * 60 + Number(match[2]);
}

export async function getTimerText(page: Page): Promise<string> {
  return ((await page.locator(SEL.timerDisplay).textContent()) ?? "").trim();
}

export async function getTimerSeconds(page: Page): Promise<number> {
  return parseTimerValue(await getTimerText(page));
}

export async function getStatusText(page: Page): Promise<string> {
  return ((await page.locator(SEL.statusText).textContent()) ?? "").trim();
}

export async function getPrimaryButtonLabel(page: Page): Promise<string> {
  return ((await page.locator(SEL.primaryButton).textContent()) ?? "").trim();
}

export async function clickPrimaryButton(page: Page): Promise<void> {
  await page.locator(SEL.primaryButton).click();
}

export async function clickResetButton(page: Page): Promise<void> {
  await page.locator(SEL.resetButton).click();
}

export async function clickFocusMode(page: Page): Promise<void> {
  await page.locator(SEL.focusToggle).click();
}

export async function clickBreakMode(page: Page): Promise<void> {
  await page.locator(SEL.breakToggle).click();
}

function modeLocator(page: Page, mode: "focus" | "break"): Locator {
  return page.locator(mode === "focus" ? SEL.focusToggle : SEL.breakToggle);
}

export async function isModeSelected(
  page: Page,
  mode: "focus" | "break"
): Promise<boolean> {
  const node = modeLocator(page, mode);
  const [ariaPressed, dataState, className] = await Promise.all([
    node.getAttribute("aria-pressed"),
    node.getAttribute("data-state"),
    node.getAttribute("class"),
  ]);

  return (
    ariaPressed === "true" ||
    dataState === "active" ||
    dataState === "selected" ||
    /\b(active|selected|ant-segmented-item-selected)\b/.test(className ?? "")
  );
}

export async function expectModeSelected(
  page: Page,
  mode: "focus" | "break"
): Promise<void> {
  await expect
    .poll(async () => isModeSelected(page, mode), {
      message: `Expected ${mode} mode to be selected`,
    })
    .toBe(true);
}

export async function expectTimerFormat(page: Page): Promise<void> {
  await expect(page.locator(SEL.timerDisplay)).toHaveText(/^\d{1,2}:[0-5]\d$/);
}

export async function expectTimerText(page: Page, value: string): Promise<void> {
  await expect(page.locator(SEL.timerDisplay)).toHaveText(value);
}

export async function expectStatusContains(
  page: Page,
  value: string | RegExp
): Promise<void> {
  if (typeof value === "string") {
    await expect(page.locator(SEL.statusText)).toContainText(value);
  } else {
    await expect(page.locator(SEL.statusText)).toHaveText(value);
  }
}

export async function expectPrimaryButtonLabel(
  page: Page,
  label: string | RegExp
): Promise<void> {
  if (typeof label === "string") {
    await expect(page.locator(SEL.primaryButton)).toHaveText(label);
  } else {
    await expect(page.locator(SEL.primaryButton)).toHaveText(label);
  }
}

export async function waitForTimerTick(
  page: Page,
  fromSeconds: number
): Promise<number> {
  await expect
    .poll(async () => getTimerSeconds(page), {
      message: `Expected timer to change from ${fromSeconds}`,
      timeout: 2_500,
      intervals: [100, 250, 500],
    })
    .not.toBe(fromSeconds);

  return getTimerSeconds(page);
}

export async function expectTimerDecrementedByAtLeast(
  page: Page,
  previous: number,
  amount: number
): Promise<void> {
  const current = await getTimerSeconds(page);
  expect(current).toBeLessThanOrEqual(previous - amount);
}

export async function expectModeSwitchDialogVisible(page: Page): Promise<void> {
  await expect(page.locator(SEL.confirmDialog)).toBeVisible();
}

export async function expectModeSwitchDialogHidden(page: Page): Promise<void> {
  await expect(page.locator(SEL.confirmDialog)).toBeHidden();
}

export async function confirmModeSwitch(page: Page): Promise<void> {
  await page.locator(SEL.confirmDialogConfirm).click();
}

export async function cancelModeSwitch(page: Page): Promise<void> {
  await page.locator(SEL.confirmDialogCancel).click();
}

export async function dismissDialogWithEscape(page: Page): Promise<void> {
  await page.keyboard.press("Escape");
}

export async function dismissDialogByClickingOutside(page: Page): Promise<void> {
  await page.mouse.click(5, 5);
}

export async function expectCompletionVisible(page: Page): Promise<void> {
  await expect(page.locator(SEL.completionBanner)).toBeVisible();
}

export async function dismissCompletionBanner(page: Page): Promise<void> {
  await page.locator(SEL.dismissCompletion).click();
}

export async function expectErrorVisible(page: Page): Promise<void> {
  await expect(page.locator(SEL.errorHeading)).toBeVisible();
}

export async function clickErrorRetry(page: Page): Promise<void> {
  await page.locator(SEL.errorRetry).click();
}

export async function clickErrorBackToTimer(page: Page): Promise<void> {
  await page.locator(SEL.errorBackToTimer).click();
}