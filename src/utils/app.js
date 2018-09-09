export const isPathCorrect = (location, explorerRoutes) => {
  const locationElements = location.pathname.split('/').slice(2).filter(x => x);
  const isValid = explorerRoutes.find((route) => {
    const fullRouteName = route.path + (route.pathSuffix || '');
    const routeElements = fullRouteName.split('/').slice(1);
    return locationElements[0] === routeElements[0]
    && (locationElements[locationElements.length - 1] !== '')
    && ((locationElements.length === 2 && !!route.pathSuffix)
      || (locationElements.length < 2 && !route.pathSuffix));
  });
  return isValid ? location.pathname : false;
};
export const getDeviceMetadata = /* istanbul ignore next */() => {
  /* istanbul ignore next */
  const {
    platform,
    appCodeName,
    appName,
    appVersion,
    language,
    oscpu,
    vendor,
    vendorSub,
    product,
    userAgent,
    cookieEnabled,
  } = window.navigator;
  return {
    platform,
    appCodeName,
    appName,
    appVersion,
    language,
    oscpu,
    vendor,
    vendorSub,
    product,
    userAgent,
    cookieEnabled,
  };
};

export default isPathCorrect;
