// Track active tab and time spent
let activeTabId = null;
let activeTabStartTime = null;
let trackedSites = {};

// Listen for tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
  const currentTime = Date.now();
  
  // If there was an active tab, record the time spent
  if (activeTabId !== null && activeTabStartTime !== null) {
    const timeSpent = currentTime - activeTabStartTime;
    
    // Get the tab URL to determine the domain
    chrome.tabs.get(activeTabId, tab => {
      if (tab.url) {
        const domain = extractDomain(tab.url);
        if (!trackedSites[domain]) {
          trackedSites[domain] = 0;
        }
        trackedSites[domain] += timeSpent;
        
        // Save to storage
        chrome.storage.local.set({ trackedSites });
      }
    });
  }
  
  // Set the new active tab
  activeTabId = activeInfo.tabId;
  activeTabStartTime = currentTime;
});

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}
