import { expect } from 'chai';
import { isPathCorrect } from './app';
import routes from '../constants/routes';

describe('App Util', () => {
  it('should detach wrong urls', () => {
    const allRoutes = Object.values(routes);
    const explorerRoutes = allRoutes.filter(routeObj =>
      routeObj.pathPrefix && routeObj.pathPrefix === routes.explorer.path);

    const invalidURLs = ['/explorer/search/123',
      '/explorer/accounts/16313739661670634666L/hi'];
    for (let i = 0; i < invalidURLs.length; i++) {
      const data = isPathCorrect({ pathname: invalidURLs[i] }, explorerRoutes);
      expect(data).to.be.equal(false);
    }
  });

  it('should detach right urls', () => {
    const allRoutes = Object.values(routes);
    const explorerRoutes = allRoutes.filter(routeObj =>
      routeObj.pathPrefix && routeObj.pathPrefix === routes.explorer.path);

    const invalidURLs = ['/explorer/search', '/explorer/search/',
      '/explorer/accounts/16313739661670634666L'];
    for (let i = 0; i < invalidURLs.length; i++) {
      const data = isPathCorrect({ pathname: invalidURLs[i] }, explorerRoutes);
      expect(data).to.be.equal(invalidURLs[i]);
    }
  });
});

