# Privacy Policy for RTBF Auvio Ad Skipper

**Effective Date:** July 2026

The "RTBF Auvio Ad Skipper" Chrome extension is built as an independent developer tool. We value user privacy and have designed this extension with strict privacy principles.

### 1. Information Collection and Use
* **No Personal Data Collection:** This extension does not collect, track, store, transmit, or share any personal data, browsing history, or user identity information.
* **Local Storage Only:** The extension uses `chrome.storage.local` exclusively on your own machine. This is used solely to remember your preferred settings (whether the extension status is "Active" or "Disable") and to maintain the "Ad Breaks Skipped" lifetime statistics counter. This data never leaves your device.

### 2. Permissions Justification
* **Host Permissions (`https://auvio.rtbf.be/*`):** Required strictly to inject the local content script (`content.js`) into the streaming player page. This script monitors the standard video tags and DOM elements locally to manipulate playback speed during ad sequences.
* **Storage Permission:** Required solely to allow the popup menu to read and write your toggle choice and update the local statistics counter.

### 3. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. Any changes will be posted directly to this repository.

### 4. Contact
If you have any questions or feedback regarding this extension, feel free to open an issue directly in the GitHub repository or contact the developer via Yashvir Gaming.
