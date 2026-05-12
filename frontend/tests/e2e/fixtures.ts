import { test as base, expect, type Page } from "@playwright/test";

/**
 * Custom fixtures for the Pomodoro Timer E2E suite.
 *
 * - `timerPage` – navigates to `/` and waits for the timer display to appear.
 * - `clock`     – helper that installs Playwright's fake timers on demand,
 *                 allowing tests to fast-forward time without waiting.
 */

type TimerFixtures = {
  timerPage: Page;
  clock: {
    install: () => Promise<void>;
    fastForward: (ms: number) => Promise<void>;
    resume: () => Promise<void>;
  };
};

export const test = base.extend<TimerFixtures>({
  timerPage: async ({ page }, use) => {
    await page.goto("/");
    // Wait for the timer display to be visible (assumes data-testid="timer-display")
    await page.waitForSelector('[data-testid="timer-display"]', {
      state: "visible",
      timeout: 10_000,
    });
    await use(page);
  },

  clock: async ({ page }, use) => {
    const helper = {
      install: () => page.clock.install(),
      fastForward: (ms: number) => page.clock.fastForward(ms),
      resume: () => page.clock.resume(),
    };
    await use(helper);
  },
});

export { expect };