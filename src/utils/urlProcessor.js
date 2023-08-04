import { parseSearchParams } from 'src/utils/searchParams';
import { getAccounts } from '@wallet/utils/api';
import { regex } from 'src/const/regex';
import { validateAddress } from 'src/utils/validators';
import { stakeEdited } from '@pos/validator/store/actions/staking';

const isUsernameValid = (username) => regex.name.test(username);

/**
 * Returns an empty array if the given list is not an array
 * of usernames in string format
 *
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

  const areUsernamesValid = usernames.every((username) => isUsernameValid(username));

  if (!areUsernamesValid) {
    return [];
  }

  return usernames;
};

/**
 * Fetches the accounts corresponding to the usernames
 * passed by stakes and unstakes query params
 *
 * @returns {Promise} - A promise that resolves after all accounts are fetched
 */
const urlProcessor = (search, network) => {
  const params = parseSearchParams(search);
  const stakes = normalizeUsernames(params.stakes);
  const unstakes = normalizeUsernames(params.unstakes);

  if (stakes.length + unstakes.length === 0) {
    return { data: [] };
  }

  return getAccounts({
    network,
    params: { usernameList: [...stakes, ...unstakes] },
  });
};

const setStakesByLaunchProtocol = (search) => async (dispatch, getState) => {
  const { network } = getState();
  const accounts = await urlProcessor(search, network);

  return dispatch(
    stakeEdited(
      accounts.data
        .filter(({ summary }) => validateAddress(summary.address) === 0)
        .map(({ summary, pos }) => ({
          address: summary.address,
          username: pos.validator.username,
          amount: '',
        }))
    )
  );
};

export default setStakesByLaunchProtocol;
