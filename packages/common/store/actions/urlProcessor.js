import { parseSearchParams } from 'src/utils/searchParams';
import { getAccounts } from '@wallet/utils/api';
import { regex } from 'src/const/regex';
import { tokenMap } from '@token/fungible/consts/tokens';
import { validateAddress } from 'src/utils/validators';
import { voteEdited } from '@dpos/validator/store/actions/voting';

const isUsernameValid = username => regex.delegateName.test(username);

/**
 * Returns an empty array if the given list is not an array
 * of usernames in string format
 *
 * @param {[String]} usernames Array of usernames
 * @returns {[String]} Array of strings or an empty array
 */
const normalizeUsernames = (usernames) => {
  if (usernames === undefined) {
    return [];
  }

  if (!Array.isArray(usernames)) {
    if (isUsernameValid(usernames)) {
      return [usernames];
    }
    return [];
  }

  const areUsernamesValid = usernames.every(username => isUsernameValid(username));

  if (!areUsernamesValid) {
    return [];
  }

  return usernames;
};

/**
 * Fetches the accounts corresponding to the usernames
 * passed by votes and unvotes query params
 *
 * @param {String} search - Search string from history.location
 * @param {Object} network - network config from Redux store
 * @returns {Promise} - A promise that resolves after all accounts are fetched
 */
const urlProcessor = (search, network) => {
  const params = parseSearchParams(search);
  const votes = normalizeUsernames(params.votes);
  const unvotes = normalizeUsernames(params.unvotes);

  if (votes.length + unvotes.length === 0) {
    return { data: [] };
  }

  return getAccounts({
    network,
    params: { usernameList: [...votes, ...unvotes] },
  }, tokenMap.LSK.key);
};

const setVotesByLaunchProtocol = search =>
  async (dispatch, getState) => {
    const { network } = getState();
    const accounts = await urlProcessor(search, network);

    return dispatch(
      voteEdited(accounts.data
        .filter(({ summary }) => validateAddress(tokenMap.LSK.key, summary.address) === 0)
        .map(
          ({ summary, dpos }) => ({ address: summary.address, username: dpos.delegate.username, amount: '' }),
        )),
    );
  };

export default setVotesByLaunchProtocol;
