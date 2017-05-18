app.factory('Sync', ($rootScope, $window) => {
  const config = {
    updateInterval: 10000,
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
   * sends a numeric factor for ease of use as a multiples of updateInterval.
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
  /**
   * Starts the first frame by calling requestAnimationFrame.
   * Tis will be
   */
  const init = () => {
    if (!running) {
      $window.requestAnimationFrame(step);
    }
  };

  /**
   * Stops animation by preventing the next frame to fire
   */
  const end = () => {
    config.freeze = false;
  };

  init();
  return {
    init, config, end,
  };
});
