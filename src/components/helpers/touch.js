// Real touch-only devices (e.g. BrowserStack phones) do not get keyboard input reliably, and
// coordinate clicks there can land on a neighbouring element
export async function isTouchOnly(page) {
  return page.evaluate(() => !window.matchMedia('(pointer: fine)').matches);
}
