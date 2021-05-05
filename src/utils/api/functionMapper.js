const functionMapper = (lskFunctions, btcFunction) => {
  const lskNames = Object.keys(lskFunctions);
  const btcNames = Object.keys(btcFunction);

  const resourceMap = {
    LSK: lskFunctions,
    BTC: btcFunction,
  };

  const resources = lskNames.reduce((acc, item) => {
    if (btcNames.includes(item)) {
      acc.common.push(item);
    } else {
      acc.LskSpecific.push(item);
    }

    return acc;
  }, { common: [], LskSpecific: [] });

  return {
    // Common methods
    ...resources.common.reduce((acc, fnName) => {
      acc[fnName] = (data, token) => resourceMap[token][fnName](data);

      return acc;
    }, {}),

    // LSK specific methods
    ...resources.LskSpecific.reduce((acc, fnName) => {
      acc[fnName] = resourceMap.LSK[fnName];
      return acc;
    }, {}),

    // BTC specific methods
    ...btcNames
      .filter(item => !resources.common.includes(item))
      .reduce((acc, fnName) => {
        acc[fnName] = resourceMap.BTC[fnName];
        return acc;
      }, {}),
  };
};

export default functionMapper;
