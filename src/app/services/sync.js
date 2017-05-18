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
   * @param {Number} factor 
   * @param {Date} lastTick 
   * @param {Date} timeStamp 
   */
  const broadcast = (lastTick, timeStamp, factor) => {
    $rootScope.$broadcast('syncTick', {
      factor, lastTick, timeStamp,
    });
  };

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

  const init = () => {
    if (!running) {
      $window.requestAnimationFrame(step);
    }
  };

  init();
  return {
    init, config, end,
  };
});
