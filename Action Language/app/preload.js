// Preload script runs before the renderer process
// It has access to Node.js APIs and can expose safe APIs to the renderer

const { contextBridge } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // We'll add more APIs here as needed
  getAppInfo: () => {
    return {
      name: 'ActionLanguage Transcoder',
      version: '1.0.0',
      platform: process.platform
    };
  }
});

console.log('Preload script loaded successfully');
