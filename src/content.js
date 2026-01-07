/**
 * Tailhook - Content Script
 * Monitors ChatGPT response completion and triggers key combinations
 */

// Configuration
const CONFIG = {
  DEBOUNCE_DELAY: 800, // ms to wait after last DOM change before triggering
  KEY_COMBINATION: {
    key: 'T',
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    metaKey: false
  }
};

// State management
let isEnabled = true;
let debounceTimer = null;
let isStreaming = false;
let lastResponseElement = null;
let observer = null;

/**
 * Load extension state from storage
 */
async function loadState() {
  try {
    const result = await chrome.storage.local.get(['enabled']);
    isEnabled = result.enabled !== false; // Default to true
    console.log('[Tailhook] Extension enabled:', isEnabled);
  } catch (error) {
    console.error('[Tailhook] Error loading state:', error);
  }
}

/**
 * Listen for state changes from popup
 */
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) {
    isEnabled = changes.enabled.newValue;
    console.log('[Tailhook] State changed. Enabled:', isEnabled);
  }
});

/**
 * Dispatch keyboard event to trigger Logi Options+ Smart Actions
 */
function triggerKeyboardEvent() {
  if (!isEnabled) {
    console.log('[Tailhook] Extension is disabled, skipping key event');
    return;
  }

  const { key, ctrlKey, shiftKey, altKey, metaKey } = CONFIG.KEY_COMBINATION;

  // Create keyboard events (keydown, keypress, keyup)
  const eventOptions = {
    key,
    code: `Key${key}`,
    keyCode: key.charCodeAt(0),
    which: key.charCodeAt(0),
    ctrlKey,
    shiftKey,
    altKey,
    metaKey,
    bubbles: true,
    cancelable: true,
    composed: true
  };

  // Dispatch events in sequence
  const keydownEvent = new KeyboardEvent('keydown', eventOptions);
  const keypressEvent = new KeyboardEvent('keypress', eventOptions);
  const keyupEvent = new KeyboardEvent('keyup', eventOptions);

  document.dispatchEvent(keydownEvent);
  document.dispatchEvent(keypressEvent);
  document.dispatchEvent(keyupEvent);

  console.log('[Tailhook] ✓ Key combination triggered:', `${ctrlKey ? 'Ctrl+' : ''}${shiftKey ? 'Shift+' : ''}${altKey ? 'Alt+' : ''}${metaKey ? 'Meta+' : ''}${key}`);
}

/**
 * Check if ChatGPT is currently streaming a response
 */
function checkIfStreaming() {
  // Look for the "Stop generating" button
  const stopButton = document.querySelector('button[aria-label*="Stop"]') ||
                     document.querySelector('button:has-text("Stop generating")');

  // Look for streaming indicators in the response area
  const streamingIndicator = document.querySelector('[data-message-author-role="assistant"]');

  return !!stopButton || (streamingIndicator && !streamingIndicator.querySelector('[data-testid="conversation-turn-complete"]'));
}

/**
 * Handle detected response completion
 */
function onResponseComplete() {
  console.log('[Tailhook] Response completion detected');
  triggerKeyboardEvent();
  isStreaming = false;
}

/**
 * Debounced completion handler
 */
function handleDOMChange() {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Check if currently streaming
  const currentlyStreaming = checkIfStreaming();

  if (currentlyStreaming) {
    isStreaming = true;
  } else if (isStreaming) {
    // Was streaming, now stopped - set debounce timer
    debounceTimer = setTimeout(() => {
      onResponseComplete();
      debounceTimer = null;
    }, CONFIG.DEBOUNCE_DELAY);
  }
}

/**
 * Initialize MutationObserver to monitor ChatGPT responses
 */
function initializeObserver() {
  // Target the main conversation container
  const targetNode = document.body;

  if (!targetNode) {
    console.error('[Tailhook] Could not find target node');
    return;
  }

  // Create observer
  observer = new MutationObserver((mutations) => {
    // Filter mutations related to ChatGPT response area
    const relevantMutations = mutations.filter(mutation => {
      const target = mutation.target;

      // Check if mutation is in the conversation area
      if (target.nodeType === Node.ELEMENT_NODE) {
        const element = target;
        return element.closest('[data-message-author-role]') ||
               element.querySelector('[data-message-author-role]') ||
               Array.from(mutation.addedNodes).some(node =>
                 node.nodeType === Node.ELEMENT_NODE &&
                 (node.closest('[data-message-author-role]') || node.querySelector('[data-message-author-role]'))
               );
      }
      return false;
    });

    if (relevantMutations.length > 0) {
      handleDOMChange();
    }
  });

  // Start observing
  observer.observe(targetNode, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'data-message-author-role']
  });

  console.log('[Tailhook] MutationObserver initialized');
}

/**
 * Initialize content script
 */
async function initialize() {
  console.log('[Tailhook] Content script loaded');

  // Load initial state
  await loadState();

  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeObserver);
  } else {
    // DOM already loaded
    setTimeout(initializeObserver, 1000); // Small delay to ensure ChatGPT UI is ready
  }
}

// Start the extension
initialize();
