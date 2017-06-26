import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import account from './account';
import actionTypes from '../constants/actions';


chai.use(sinonChai);

describe('Reducer: account(state, action)', () => {
  let state;

  beforeEach(() => {
    state = {
      balance: 0,
      passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
      publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
      address: '16313739661670634666L',
    };
  });

  it('should return account obejct with changes if action.type = actionTypes.accountUpdated', () => {
    const action = {
      type: actionTypes.accountUpdated,
      data: {
        passphrase: state.passphrase,
        balance: 100000000,
      },
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({
      balance: action.data.balance,
      passphrase: state.passphrase,
      publicKey: state.publicKey,
      address: state.address,
    });
  });

  it('should return empty account obejct if action.type = actionTypes.accountLoggedOut', () => {
    const action = {
      type: actionTypes.accountLoggedOut,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({ });
  });
});

