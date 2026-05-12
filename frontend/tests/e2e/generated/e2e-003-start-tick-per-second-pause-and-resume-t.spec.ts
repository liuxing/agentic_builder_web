import { test, expect } from "../fixtures";
import {
  SEL,
  getTimerText,
  getPrimaryButtonLabel,
  clickPrimaryButton,
} from "../utils";

/**
 * E2E-003 — Start, tick per second, pause, and resume timer
 *
 * Covered requirement IDs:
 * US-01, US-03, FR-TM03, FR-TM04, FR-TM06, FR-UI04,
 * AC-03, AC-04, AC-05, AC-07
 */

test.describe("E2E-003 — Start, tick per second, pause, and resume timer", () => {
  test("timer starts within 1 second and decrements each tick", async ({
    timerPage: page,
    clock,
  }) => {
    // Use fake timers so we can control the countdown precisely.
    await clock.install();

    // Initial state: Focus 25:00, idle, button shows Start
    await expect(page.locator(SEL.timerDisplay)).toHaveText("25:00");
    expect(await getPrimaryButtonLabel(page)).toMatch(/start/i);

    // Start the timer
    await clickPrimaryButton(page);

    // Fast-forward 1 second — the timer should tick once.
    await clock.fastForward(1000);
    const afterOneTick = await getTimerText(page);
    expect(afterOneTick).toBe("24:59");
    expect(await getPrimaryButtonLabel(page)).toMatch(/pause/i);

    // Fast-forward 3 more seconds — total elapsed 4 seconds => 24:56
    await clock.fastForward(3000);
    const afterFourTicks = await getTimerText(page);
    expect(afterFourTicks).toBe("24:56");
  });

  test("pausing stops countdown and changes button label to Resume", async ({
    timerPage: page,
    clock,
  }) => {
    await clock.install();

    // Start timer, let it run for 4 seconds (25:00 → 24:56)
    await clickPrimaryButton(page);
    await clock.fastForward(4000);
    expect(await getTimerText(page)).toBe("24:56");
    expect(await getPrimaryButtonLabel(page)).toMatch(/pause/i);

    // Click Pause
    await clickPrimaryButton(page);
    // Button label should switch to Resume
    expect(await getPrimaryButtonLabel(page)).toMatch(/resume/i);

    // Fast-forward 3 seconds — timer must NOT change
    const frozenValue = await getTimerText(page);
    await clock.fastForward(3000);
    expect(await getTimerText(page)).toBe(frozenValue);
  });

  test("resuming continues from the paused value", async ({
    timerPage: page,
    clock,
  }) => {
    await clock.install();

    // Start, run for 4 seconds, then pause at 24:56
    await clickPrimaryButton(page);
    await clock.fastForward(4000);
    await clickPrimaryButton(page); // pause
    expect(await getTimerText(page)).toBe("24:56");

    // Resume
    await clickPrimaryButton(page); // button now shows Resume
    expect(await getPrimaryButtonLabel(page)).toMatch(/pause/i); // changes back to Pause on resume

    // Fast-forward 1 second — timer should tick down from 24:56 to 24:55
    await clock.fastForward(1000);
    expect(await getTimerText(page)).toBe("24:55");
  });
});