document.addEventListener('DOMContentLoaded', () => {
  const statusToggle = document.getElementById('status-toggle');
  const statusIndicator = document.getElementById('status-indicator');
  const statusWord = document.getElementById('status-word');
  const lifetimeCounter = document.getElementById('lifetime-counter');
  const resetBtn = document.getElementById('reset-btn');

  // Load configuration from local extension storage
  chrome.storage.local.get(['extensionEnabled', 'skippedCount'], (data) => {
    // Default to true if not set yet
    const isEnabled = data.extensionEnabled !== false; 
    statusToggle.checked = isEnabled;
    updateStatusUI(isEnabled);

    // Load statistics counter
    if (data.skippedCount !== undefined) {
      lifetimeCounter.textContent = data.skippedCount;
    }
  });

  // Track state flips on the switch
  statusToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    updateStatusUI(isEnabled);
    
    // Save selection so background tasks or content blocks read the active state
    chrome.storage.local.set({ extensionEnabled: isEnabled });
  });

  // Handle stats reset click
  resetBtn.addEventListener('click', () => {
    chrome.storage.local.set({ skippedCount: 0 }, () => {
      lifetimeCounter.textContent = '0';
    });
  });

  // Dynamic visual controller for the Active / Disabled switch state
  function updateStatusUI(isActive) {
    if (isActive) {
      statusIndicator.classList.remove('disabled');
      statusIndicator.classList.add('active');
      statusWord.textContent = 'Active';
    } else {
      statusIndicator.classList.remove('active');
      statusIndicator.classList.add('disabled');
      statusWord.textContent = 'Disable'; // Your requested switch value
    }
  }
  
  // Force the author link to open a new tab safely in the main browser window
  const authorLink = document.getElementById('author-link');
  if (authorLink) {
    authorLink.addEventListener('click', (event) => {
      event.preventDefault(); // Prevents the popup from trying to load the page internally
      chrome.tabs.create({ url: authorLink.href });
    });
  }

});