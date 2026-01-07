/**
 * Tailhook - Popup Script
 * Manages extension settings UI
 */

const toggleEnabled = document.getElementById('toggle-enabled');
const statusElement = document.getElementById('status');
const statusText = document.getElementById('status-text');

/**
 * Load current state from storage
 */
async function loadState() {
  try {
    const result = await chrome.storage.local.get(['enabled']);
    const isEnabled = result.enabled !== false; // Default to true

    toggleEnabled.checked = isEnabled;
    updateStatusDisplay(isEnabled);
  } catch (error) {
    console.error('[Tailhook] Error loading state:', error);
  }
}

/**
 * Update status display based on enabled state
 */
function updateStatusDisplay(isEnabled) {
  if (isEnabled) {
    statusElement.classList.remove('disabled');
    statusText.textContent = 'Active';
  } else {
    statusElement.classList.add('disabled');
    statusText.textContent = 'Disabled';
  }
}

/**
 * Save state to storage
 */
async function saveState(enabled) {
  try {
    await chrome.storage.local.set({ enabled });
    updateStatusDisplay(enabled);
    console.log('[Tailhook] State saved:', enabled);
  } catch (error) {
    console.error('[Tailhook] Error saving state:', error);
  }
}

/**
 * Handle toggle change
 */
toggleEnabled.addEventListener('change', (event) => {
  const isEnabled = event.target.checked;
  saveState(isEnabled);
});

// Initialize popup
loadState();
