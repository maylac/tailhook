/**
 * Tailhook - Background Service Worker
 * Manages extension lifecycle and state
 */

// Initialize extension state on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[Tailhook] Extension installed/updated:', details.reason);

  // Set default state
  if (details.reason === 'install') {
    await chrome.storage.local.set({ enabled: true });
    console.log('[Tailhook] Default state initialized: enabled=true');
  }
});

// Handle extension icon clicks (if needed for future features)
chrome.action.onClicked.addListener((tab) => {
  console.log('[Tailhook] Extension icon clicked on tab:', tab.id);
});

// Keep service worker alive (optional, for debugging)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Tailhook] Message received:', message);
  sendResponse({ received: true });
  return true;
});

console.log('[Tailhook] Background service worker initialized');
