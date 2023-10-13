import { regex } from 'src/const/regex';
import { MAX_MULTI_SIG_MEMBERS } from '../../configuration/constants';

const validators = [
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length === 0 && (optional.length === signatures || optional.length > 0),
    message: (t) => t('All members can not be optional. Consider changing them to mandatory.'),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 && optional.length === 0 && signatures !== mandatory.length,
    message: (t) => t('Number of signatures must be equal to the number of members.'),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 && optional.length > 0 && signatures < mandatory.length,
    message: (t, mandatory) =>
      t(
        t('Number of signatures must be above {{num}}.', {
          num: mandatory.length,
        })
      ),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 &&
      optional.length > 0 &&
      signatures === mandatory.length + optional.length,
    message: (t) =>
      t('Either change the optional member to mandatory or reduce the number of signatures.'),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 &&
      optional.length > 0 &&
      signatures > mandatory.length + optional.length,
    message: (t, mandatory, optional) =>
      t('Number of signatures must be lower than {{num}}.', {
        num: mandatory.length + optional.length,
      }),
  },
  {
    pattern: (mandatory, optional) => mandatory.length + optional.length > MAX_MULTI_SIG_MEMBERS,
    message: (t) =>
      t('Maximum number of members is {{MAX_MULTI_SIG_MEMBERS}}.', {
        MAX_MULTI_SIG_MEMBERS,
      }),
  },
  {
    pattern: (mandatory, optional) =>
      mandatory.some((item) => !regex.publicKey.test(item)) ||
      optional.some((item) => !regex.publicKey.test(item)),
    message: (t) => t('Please enter a valid public key for each member.'),
  },
  {
    pattern: (mandatory, optional) => {
      const allKeys = mandatory.concat(optional);
      const keysMap = allKeys.reduce((result, key) => {
        result[key] = true;
        return result;
      }, {});

      return Object.keys(keysMap).length !== allKeys.length;
    },
    message: (t) => t('Duplicate public keys detected.'),
  },
  {
    pattern: (mandatory, optional, numberOfSignatures, currentAccount) => {
      const index = [...mandatory, ...optional].findIndex(
        (key) => key === currentAccount.metadata?.pubkey
      );
      return index >= 0 && numberOfSignatures === 1;
    },
    message: (t) =>
      t('Please add a member beyond yourself for registering multisignature account.'),
  },
];

export default validators;
