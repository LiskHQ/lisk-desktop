/**
 * Add ipcRenderer to the window object
 */
const ipcRenderer = window.require('electron').ipcRenderer;
window.ipc = ipcRenderer;
