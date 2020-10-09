import { parseSearchParams } from '../../../utils/searchParams';
import { getAccount } from '../../../utils/api/lsk/account';
import { voteEdited } from '../../../actions/voting';
import regex from '../../../utils/regex';

/**
 * Get accounts from Lisk Core using usernames list
 *
 * @param {[String]} usernames - Array of usernames
 * @param {Object} network - network config from Redux store
 * @returns {Promise} - API call promise
 */
const getAccounts = async (usernames, network) =>
  Promise.all(usernames.map(username => getAccount({ username, network })));

/**
 * Returns an empty array if the given list is not an array
 * of usernames in string format
 *
 * @param {[String]} usernames Array of usernames
 * @returns {[String]} Array of strings or an empty array
 */
const normalizeUsernames = (usernames) => {
  if (!Array.isArray(usernames)) return [];
  const isValid = usernames.reduce((flag, username) =>
    (flag && typeof username === 'string' && username.length > 3), true);
  if (!isValid) return [];

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
  const usernames = normalizeUsernames([...params.votes, ...params.unvotes]);

  return getAccounts(usernames, network);
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
