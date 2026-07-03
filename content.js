// Function to handle video speed manipulation
function handleAuvioAds() {
  // CRITICAL FIX: Check if the extension is enabled in storage first
  chrome.storage.local.get(['extensionEnabled'], (data) => {
    // Default to true if not set yet
    const isEnabled = data.extensionEnabled !== false;
    
    // Locate the video element
    const video = document.querySelector('video');
    if (!video) return;

    // If the user turned the slider off ("Disable"), force normal playback and exit
    if (!isEnabled) {
      if (video.playbackRate === 16) {
        video.playbackRate = 1;
        video.muted = false;
        print("[Auvio Skipper] Extension is Disabled. Resetting to normal speed.");
      }
      return; 
    }

    // Identify if an ad is playing
    const isAdPlaying = checkForAdIndicators();

    if (isAdPlaying) {
      video.muted = true; 
      
      // Live stream jump logic
      if (window.location.href.includes('/live/')) {
        try {
          if (video.seekable && video.seekable.length > 0) {
            video.currentTime = video.seekable.end(video.seekable.length - 1);
            console.log("[Auvio Skipper] Live ad detected. Jumping to live edge...");
            incrementSkippedCount(); // Update the statistics counter
            return;
          }
        } catch (e) {
          console.error("[Auvio Skipper] Failed to jump to live edge:", e);
        }
      }
      
      // Replay fast-forward logic
      if (video.playbackRate !== 16) {
        video.playbackRate = 16;
        console.log("[Auvio Skipper] Ad detected. Fast-forwarding (16x)...");
        incrementSkippedCount(); // Update the statistics counter
      }

    } else {
      // Reset to normal speed when the main content resumes
      if (video.playbackRate === 16) {
        video.playbackRate = 1;
        video.muted = false;
        console.log("[Auvio Skipper] Main content resumed. Resetting speed.");
      }
    }
  });
}

// Helper function to update the popup stats counter seamlessly
let adTracked = false;
function incrementSkippedCount() {
  if (!adTracked) {
    adTracked = true;
    chrome.storage.local.get(['skippedCount'], (data) => {
      const currentCount = data.skippedCount || 0;
      chrome.storage.local.set({ skippedCount: currentCount + 1 });
    });
    
    // Reset the tracker block after 10 seconds so the next ad break counts too
    setTimeout(() => { adTracked = false; }, 10000);
  }
}

// Helper function to detect ads based on DOM changes
function checkForAdIndicators() {
  const bodyText = document.body.innerText || "";
  if (bodyText.includes("Votre contenu reprendra dans") || bodyText.includes("Publicité")) {
    return true;
  }

  const adUiContainer = document.querySelector('.rmp-ad-container, .vjs-ad-playing, [class*="ad-"]');
  if (adUiContainer && adUiContainer.offsetHeight > 0) {
    return true;
  }

  return false;
}

// Set up a MutationObserver to watch for player/DOM changes dynamically
const observer = new MutationObserver(() => {
  handleAuvioAds();
});

// Start observing the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Continuous fallback check for video time updates
document.addEventListener('timeupdate', (e) => {
  if (e.target.tagName === 'VIDEO') {
    handleAuvioAds();
  }
}, true);