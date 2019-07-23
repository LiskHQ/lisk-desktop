import transactionTypes from './transactionTypes';

export default {
  [transactionTypes.setSecondPassphrase]: 'tx2ndPassphrase',
  [transactionTypes.registerDelegate]: 'txDelegate',
  [transactionTypes.vote]: 'txVote',
  default: 'txDefault',
};
