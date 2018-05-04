import { spy } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';

import i18n from '../../src/i18n';


// eslint-disable-next-line import/prefer-default-export
export const mountWithContext = (component, {
  storeState = {}, location = {}, middlewares = [] }) => {
  const store = configureMockStore(middlewares)(storeState);
  const history = {
    location: {
      pathname: location.pathname || '',
      search: location.search || '',
    },
    replace: spy(),
    createHref: spy(),
    push: spy(),
  };

  const options = {
    context: {
      store, history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
    lifecycleExperimental: true,
  };
  return mount(component, options);
};

