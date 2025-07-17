

import { Page } from "@playwright/test";
export async function closeAdIfPresent(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="googleads"]'); // Match iframe src containing "googleads"
      if (iframe) {
        iframe.remove(); // Remove the iframe from the DOM
      }
    });
    // const outerFrames = page.frames().filter(frame => frame.name().startsWith('aswift'));

    // for (const outerFrame of outerFrames) {
    //   const innerFrame = outerFrame.childFrames().find(f => f.name().startsWith('ad_iframe'));

    //   if (innerFrame) {
    //     // Try to close using "Close ad" button
    //     const closeAdButton = innerFrame.getByRole('button', { name: 'Close ad' });
    //     if (await closeAdButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    //       await closeAdButton.click();
    //       return;
    //     }

    //     // Fallback: try using element with id="dismiss-button"
    //     const dismissButton = innerFrame.locator('#dismiss-button');
    //     if (await dismissButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    //       await dismissButton.click();
    //       return;
    //     }
    //   }
    // }
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : String(error);
  }
}

// import { Page } from '@playwright/test';


// export async function closeAdIfPresent(page: Page): Promise<void> {
//   try {
//     const outerFrames = page.frames().filter(frame => frame.name().startsWith('aswift'));
//     for (const outerFrame of outerFrames) {
//       const innerFrame = outerFrame.childFrames().find(f => f.name().startsWith('ad_iframe'));
//       if (innerFrame) {
//         const closeButton = innerFrame.getByRole('button', { name: 'Close ad' });
//         if (await closeButton.isVisible({ timeout: 10000 })) {
//           await closeButton.click();
//           return;
//         }
//       }
//     }
    
//   } catch (error) {
//     const errorMessage = typeof error === 'object' && error !== null && 'message' in error
//       ? (error as { message?: string }).message
//       : String(error);
//   }
// }
