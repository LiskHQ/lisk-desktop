import actionTypes from '../constants/actions';

const secondPassphraseRegisteredFailure = data => ({
  type: actionTypes.secondPassphraseRegisteredFailure,
  data,
});

export default secondPassphraseRegisteredFailure;
