import { parseSearchParams } from '../utils/searchParams';
import { getAccount } from '../utils/api/lsk/account';
import { voteEdited } from './voting';
import regex from '../utils/regex';

/**
 * Get accounts from Lisk Core using usernames list
 *
 * @param {[String]} usernames - Array of usernames
 * @param {Object} network - network config from Redux store
 * @returns {Promise} - API call promise
 */
const getAccounts = async (usernames, network) =>
  Promise.all(usernames.map(username => getAccount({ username, network })));

const isUsernameValid = username => typeof username === 'string' && username.length > 3;

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

  return getAccounts([...votes, ...unvotes], network);
};

const setVotesByLaunchProtocol = search =>
  async (dispatch, getState) => {
    const { network } = getState();
    const votesAccounts = await urlProcessor(search, network);

    return dispatch(voteEdited(votesAccounts
      .filter(({ address }) => regex.address.test(address))
      .map(
        ({ address, username }) => ({ address, username, amount: '' }),
      )));
  };

export default setVotesByLaunchProtocol;
