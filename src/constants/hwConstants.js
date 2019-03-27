export const hwConstants = {
  secondPassphraseOffset: 1e5,
};
export const LEDGER_COMMANDS = {
  GET_ACCOUNT: 'GET_ACCOUNT',
  SIGN_MSG: 'SIGN_MSG',
  SIGN_TX: 'SIGN_TX',
};

export const loginType = {
  normal: 0,
  ledger: 1,
  trezor: 2,
};


export const HW_CMD = {
  GET_PUBLICKEY: 'GET_PUBLICKEY',
  GET_ADDRESS: 'GET_ADDRESS',
  SIGN_MSG: 'SIGN_MSG',
  SIGN_TX: 'SIGN_TX',
};

export const calculateSecondPassphraseIndex =
  (accountIndex, pin) => accountIndex + parseInt(pin, 10) + hwConstants.secondPassphraseOffset;
