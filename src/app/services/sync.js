app.factory('Sync', ($rootScope, $window) => {
  const config = {
    updateInterval: 10000,
    freeze: false,
  };
  let lastTick = new Date();
  const running = false;

  const broadcast = (timeStamp) => {
    $rootScope.$broadcast('syncTick', {
      lastTick, timeStamp,
    });
  };

  const step = () => {
    const now = new Date();
    if (now - lastTick >= config.updateInterval) {
      lastTick = now;
      broadcast();
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
    init, config,
  };
});
