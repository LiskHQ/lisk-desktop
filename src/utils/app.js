export const isPathCorrect = (location, explorerRoutes) => {
  const locationElements = location.pathname.split('/').slice(2);
  const isValid = explorerRoutes.find((route) => {
    const fullRouteName = route.path + (route.pathSuffix || '');
    const routeElements = fullRouteName.split('/').slice(1);
    return locationElements[0] === routeElements[0]
    && locationElements[locationElements.length - 1] !== ''
    && ((locationElements.length === 2 && !!route.pathSuffix)
      || (locationElements.length < 2 && !route.pathSuffix));
  });
  return isValid;
};

export default isPathCorrect;
