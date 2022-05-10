import blockActionTypes from '@block/store/actionTypes';
import routes from '@screens/router/routes';
import history from 'src/utils/history';
import walletActionTypes from '@wallet/store/actionTypes';
import middleware from './middleware';

jest.mock('src/utils/history');

const block = {
  numberOfTransactions: 2,
  id: '513008230952104224',
};

const newBlockCreated = {
  type: blockActionTypes.newBlockCreated,
  data: { block },
};

describe('Legacy middleware', () => {
  const next = jest.fn();

  window.Notification = () => { };
  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Basic behavior', () => {
    it('should pass the action to next middleware', async () => {
      middleware()(next)(newBlockCreated);
      expect(next).toHaveBeenCalledWith(newBlockCreated);
    });
    it('should not pass the action to next middleware', () => {
      const actionNewBlockCreatedAction = {
        type: blockActionTypes.newBlockCreated,
        data: {
          block: {
            numberOfTransactions: 0,
            id: '513008230952104224',
          },
        },
      };
      middleware()(next)(actionNewBlockCreatedAction);
      expect(next).toHaveBeenCalledWith(actionNewBlockCreatedAction);
    });
  });

  describe('on accountUpdated', () => {
    it('should not redirect to the reclaim screen if the account is migrated', async () => {
      const action = {
        type: walletActionTypes.accountLoggedIn,
        data: { info: { LSK: { summary: { isMigrated: true } } } },
      };
      middleware()(next)(action);
      expect(history.push).not.toHaveBeenCalledWith(routes.reclaim.path);
    });

    it('should redirect to the reclaim screen if the account is not migrated', async () => {
      const action = {
        type: walletActionTypes.accountLoggedIn,
        data: { info: { LSK: { summary: { isMigrated: false } } } },
      };
      middleware()(next)(action);
      expect(history.push).toHaveBeenCalledWith(routes.reclaim.path);
    });
    it('should not redirect to the reclaim screen if the account is migrated with actionUpdate', async () => {
      const action = {
        type: walletActionTypes.accountUpdated,
        data: { info: { LSK: { summary: { isMigrated: true } } } },
      };
      middleware()(next)(action);
      expect(next).toHaveBeenCalledWith(action);
    });
  });
});
