import React from 'react';
import thunk from 'redux-thunk';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { prepareStore } from '../../../test/unit-test-utils/applicationInit';
import * as search from '../../actions/search';
import accountReducer from '../../store/reducers/account';
import searchReducer from '../../store/reducers/search';
import loadingReducer from '../../store/reducers/loading';
import bookmarksReducer from '../../store/reducers/bookmarks';
import settingsReducer from '../../store/reducers/settings';
import networkReducer from '../../store/reducers/network';

import { networkSet } from '../../actions/network';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';

import AccountTransactions from './index';
import i18n from '../../i18n';
import accounts from '../../../test/constants/accounts';
import routes from '../../constants/routes';

import ExplorerTransactions from '../transactions/explorerTransactions';

describe('AccountTransaction Component', () => {
  let wrapper;
  let props;
  let searchAccountSpy;

  const store = prepareStore({
    bookmarks: bookmarksReducer,
    account: accountReducer,
    search: searchReducer,
    loading: loadingReducer,
    settings: settingsReducer,
    network: networkReducer,
  }, [thunk]);

  beforeEach(() => {
    searchAccountSpy = spy(search, 'searchAccount');

    props = {
      match: {
        url: `${routes.accounts.pathPrefix}${routes.accounts.path}/${accounts.genesis.address}`,
        params: { address: accounts.genesis.address },
      },
      history: { push: spy(), location: { search: ' ' } },
      t: key => key,
    };

    store.dispatch(networkSet({ network: getNetwork(networks.testnet.code) }));

    wrapper = mount(<Provider store={store}>
      <Router>
        <AccountTransactions {...props} i18n={i18n} />
      </Router>
    </Provider>);
  });

  afterEach(() => {
    searchAccountSpy.restore();
  });

  it('renders ExplorerTransactions', () => {
    expect(wrapper).to.have.descendants(ExplorerTransactions);
  });
});
