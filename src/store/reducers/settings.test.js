import { expect } from 'chai';
import settings from './settings';
import actionTypes from '../../constants/actions';


describe('Reducer: settings(state, action)', () => {
  let initializeState;

  const defaultTokens = {
    active: 'LSK',
    list: {
      LSK: true,
      BTC: true,
    },
  };

  const disabledBTC = {
    active: 'LSK',
    list: {
      LSK: true,
      BTC: false,
    },
  };

  const enabledBTC = {
    active: 'BTC',
    list: {
      LSK: true,
      BTC: true,
    },
  };

  const invalidBTCActivationAttempt = {
    active: 'BTC',
    list: {
      LSK: true,
      BTC: false,
    },
  };

  beforeEach(() => {
    initializeState = { autoLog: true, advancedMode: false };
  });

  it('should return updated settings if action.type = actionTypes.settingsUpdated', () => {
    const action = {
      type: actionTypes.settingsUpdated,
      data: { autoLog: false },
    };
    const changedState = settings(initializeState, action);
    expect(changedState).to.deep.equal({ autoLog: false, advancedMode: false });
  });

  it('should return updated initializeState if action.type = actionTypes.settingsReset', () => {
    const action = {
      type: actionTypes.settingsReset,
    };
    const changedState = {
      autoLog: false, advancedMode: true,
    };
    const FinalStep = settings(changedState, action);
    expect(FinalStep).to.deep.equal(initializeState);
  });

  it('should return updated settings if action.type = actionTypes.switchChannel', () => {
    const action = {
      type: actionTypes.switchChannel,
      data: { name: 'twitter', value: true },
    };
    const changedState = settings(initializeState, action);
    expect(changedState.channels).to.deep.equal({ twitter: true });
  });

  it('should return updated state', () => {
    const state = {
      token: defaultTokens,
    };
    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        token: null,
      },
    };
    const changedState = settings(state, action);
    expect(changedState).to.deep.equal({
      token: defaultTokens,
    });
  });

  it('should revert to LSK when disabling the active token', () => {
    const state = {
      token: defaultTokens,
    };
    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        token: invalidBTCActivationAttempt,
      },
    };
    const changedState = settings(state, action);
    expect(changedState).to.deep.equal({
      token: disabledBTC,
    });
  });

  it('should revert to LSK if the activated token is already disabled', () => {
    const state = {
      token: disabledBTC,
    };
    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        token: invalidBTCActivationAttempt,
      },
    };
    const changedState = settings(state, action);
    expect(changedState).to.deep.equal({
      token: disabledBTC,
    });
  });

  it('should change the active token to LSK if disables that token', () => {
    const state = {
      token: enabledBTC,
    };
    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        token: invalidBTCActivationAttempt,
      },
    };
    const changedState = settings(state, action);
    expect(changedState).to.deep.equal({
      token: disabledBTC,
    });
  });

  it('should change the active token if a new one is passed', () => {
    const state = {
      token: defaultTokens,
    };

    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        token: enabledBTC,
      },
    };

    const changedState = settings(state, action);
    expect(changedState).to.deep.equal({
      token: enabledBTC,
    });
  });

  it('should change the active token if a active token and list are correctly passed', () => {
    const state = {
      token: disabledBTC,
    };
    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        token: enabledBTC,
      },
    };
    const changedState = settings(state, action);
    expect(changedState).to.deep.equal({
      token: enabledBTC,
    });
  });
});

