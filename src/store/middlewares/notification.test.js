import configureStore from 'redux-mock-store';

import { actionTypes } from '@constants';
import Notification from '@utils/notification';
import middleware from './notification';

const fakeStore = configureStore();

describe('Notification middleware', () => {
  const next = jest.fn();
  const store = fakeStore({
    account: {
      token: {
        balance: 100,
      },
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
  });
  const accountUpdatedAction = balance => ({
    type: actionTypes.accountUpdated,
    data: {
      token: {
        balance,
      },
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should init Notification service', () => {
    const spyFn = jest.spyOn(Notification, 'init');
    middleware(store);
    expect(spyFn).toHaveBeenCalledWith();
  });

  it('should just pass action along for all actions', () => {
    const sampleAction = {
      type: 'SAMPLE_TYPE',
      data: 'SAMPLE_DATA',
    };
    middleware(store)(next)(sampleAction);
    expect(next).toHaveBeenCalledWith(sampleAction);
  });

  it(`should handle notify.about method on ${actionTypes.accountUpdated} action`, () => {
    const spyFn = jest.spyOn(Notification, 'about');
    middleware(store)(next)(accountUpdatedAction(1000));
    expect(spyFn).toHaveBeenCalledWith('deposit', 900);
  });

  it(`should not handle notify.about method on ${actionTypes.accountUpdated} action if balance the same or lower than current`, () => {
    const spyFn = jest.spyOn(Notification, 'about');
    middleware(store)(next)(accountUpdatedAction(100));
    middleware(store)(next)(accountUpdatedAction(50));
    expect(spyFn).toHaveBeenCalledTimes(0);
  });
});
