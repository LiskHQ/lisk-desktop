import OfflinePluginRuntime from 'offline-plugin/runtime';

export default {
  init: () => {
    if ('serviceWorker' in navigator) {
      OfflinePluginRuntime.install({
        onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
        onUpdated: () => window.location.reload(),
      });
    }
  },
};
