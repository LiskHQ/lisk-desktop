import { expect } from 'chai';
import secondPassphrase from './secondPassphrase';
import actionTypes from '../../constants/actions';

describe('Reducer: secondPassphrase(state, action)', () => {

  it(`should return secondPassphraseStep if action.type is ${actionTypes.secondPassphraseRegisteredFailure}`, () => {
    const state = { };
    const action = {
      type: actionTypes.secondPassphraseRegisteredFailure,
    };
    const changedState = secondPassphrase(state, action);
    expect(changedState).to.deep.equal({ secondPassphraseStep: 'second-passphrase-register-failure' });
  });

  it(`should return secondPassphraseStep(false) if action.type is ${actionTypes.secondPassphraseRegisteredFailureReset}`, () => {
    const state = { };
    const action = {
      type: actionTypes.secondPassphraseRegisteredFailureReset,
    };
    const changedState = secondPassphrase(state, action);
    expect(changedState).to.deep.equal({ secondPassphraseStep: false });
  });
});

