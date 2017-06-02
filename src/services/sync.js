const intervals = {
  activeApp: 10000,
  inactiveApp: 60000,
};

app.factory('Sync', ($rootScope, $window) => {
  const config = {
    updateInterval: intervals.activeApp,
    freeze: false,
  };
  let lastTick = new Date();
  let factor = 0;
  const running = false;

  /**
   * Broadcast an event from rootScope downwards
   *
   * @param {Date} timeStamp
   */
  const broadcast = (timeStamp) => {
    $rootScope.$broadcast('syncTick', {
      factor, lastTick, timeStamp,
    });
  };

  /**
   * We're calling this in framerate. call broadcast every config.updateInterval and
   * sends a numeric factor for ease of use as multiples of updateInterval.
   */
  const step = () => {
    const now = new Date();
    if (now - lastTick >= config.updateInterval) {
      broadcast(lastTick, now, factor);
      lastTick = now;
      factor += factor < 9 ? 1 : -9;
    }
    if (!config.freeze) {
      $window.requestAnimationFrame(step);
    }
  };

  const toggleSyncTimer = (inFocus) => {
    config.updateInterval = (inFocus) ?
      intervals.activeApp :
      intervals.inactiveApp;
  };

  const initIntervalToggler = () => {
    const { ipc } = $window;
    ipc.on('blur', () => toggleSyncTimer(false));
    ipc.on('focus', () => toggleSyncTimer(true));
  };

  /**
   * Starts the first frame by calling requestAnimationFrame.
   * This will be
   */
  const init = () => {
    if (!running) {
      $window.requestAnimationFrame(step);
    }
    if (PRODUCTION) {
      initIntervalToggler();
    }
  };

  /**
   * Stops animation by preventing the next frame to fire
   */
  const end = () => {
    config.freeze = false;
  };

  return {
    init, config, end,
  };
});
