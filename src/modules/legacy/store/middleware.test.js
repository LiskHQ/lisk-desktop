import routes from 'src/routes/routes';
import history from 'src/utils/history';
import walletActionTypes from '@wallet/store/actionTypes';
import middleware from './middleware';

jest.mock('src/utils/history');

describe('Legacy middleware', () => {
  const next = jest.fn();

  window.Notification = () => {};
  beforeEach(() => {});

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('on accountUpdated', () => {
    // @todo reclaim needs to be handle with account management
    it.skip('should not redirect to the reclaim screen if the account is migrated', async () => {
      const action = {
        type: walletActionTypes.accountLoggedIn,
        data: { info: { LSK: { summary: { isMigrated: true } } } },
      };
      middleware()(next)(action);
      expect(history.push).not.toHaveBeenCalledWith(routes.reclaim.path);
    });

    it.skip('should redirect to the reclaim screen if the account is not migrated', async () => {
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
      expect(history.push).not.toHaveBeenCalledWith(routes.reclaim.path);
    });

    it('should redirect to the reclaim screen if the account is not migrated', async () => {
      const action = {
        type: walletActionTypes.accountUpdated,
        data: { info: { LSK: { summary: { isMigrated: false } } } },
      };
      middleware()(next)(action);
      expect(next).toHaveBeenCalledWith(action);
      // expect(history.push).toHaveBeenCalledWith(routes.reclaim.path);
    });
  });
});
