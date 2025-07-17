
import { Page } from '@playwright/test';


export async function closeAdIfPresent(page: Page): Promise<void> {
  try {
    const outerFrames = page.frames().filter(frame => frame.name().startsWith('aswift'));
    for (const outerFrame of outerFrames) {
      const innerFrame = outerFrame.childFrames().find(f => f.name().startsWith('ad_iframe'));
      if (innerFrame) {
        const closeButton = innerFrame.getByRole('button', { name: 'Close ad' });
        if (await closeButton.isVisible({ timeout: 10000 })) {
          await closeButton.click();
          return;
        }
      }
    }
    
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message?: string }).message
      : String(error);
  }
}
