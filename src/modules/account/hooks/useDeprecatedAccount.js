/* istanbul ignore file */
import { useEffect, useState } from 'react';
import { useValidators, useSentStakes, useUnlocks } from '@pos/validator/hooks/queries';
import { useAuth } from '@auth/hooks/queries';
import { useLegacy } from '@legacy/hooks/queries';
import { useDispatch } from 'react-redux';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import authActionTypes from '@auth/store/actionTypes';
import { useCurrentAccount } from './useCurrentAccount';

const defaultAccount = {
  summary: {
    address: '',
    publicKey: '',
    legacyAddress: '',
    balance: '0',
    username: '',
    isMigrated: true,
    isValidator: false,
    isMultisignature: false,
  },
  // @todo same here.
  token: {
    balance: '0',
    tokenID: '00000000',
  },
  sequence: {
    nonce: '0',
  },
  keys: {
    numberOfSignatures: 0,
    mandatoryKeys: [],
    optionalKeys: [],
  },
  pos: {
    validator: {},
    sentStakes: [],
    unlocking: [],
  },
};

// eslint-disable-next-line import/prefer-default-export, complexity, max-statements
export const useDeprecatedAccount = (accountInfo) => {
  const [currentAccount] = useCurrentAccount();
  const dispatch = useDispatch();
  const { pubkey, address, hwInfo } = accountInfo || currentAccount.metadata || {};
  const [account, setAccount] = useState({ ...defaultAccount, hwInfo });

  const {
    data: sentStakes,
    isLoading: isSentStakesLoading,
    isSuccess: isSentStakesSuccess,
  } = useSentStakes({ config: { params: { address } } });
  useEffect(() => {
    if (!isSentStakesSuccess) {
      return;
    }
    setAccount((state) => ({
      ...state,
      pos: {
        ...state.pos,
        sentStakes: sentStakes?.data?.stakes || [],
      },
    }));
  }, [sentStakes, isSentStakesSuccess]);

  const {
    data: auth,
    isLoading: isAuthLoading,
    isSuccess: isAuthSuccess,
  } = useAuth({ config: { params: { address } } });
  useEffect(() => {
    if (!isAuthSuccess) {
      return;
    }
    setAccount((state) => ({
      ...state,
      summary: {
        ...state.summary,
        address,
        publicKey: auth?.meta?.publicKey || pubkey,
        username: auth?.meta?.name || '',
        isMultisignature: auth?.data?.numberOfSignatures > 0,
      },
      sequence: {
        nonce: auth?.data?.nonce || '0',
      },
      keys: {
        numberOfSignatures: auth?.data?.numberOfSignatures || [],
        mandatoryKeys: auth?.data?.mandatoryKeys || [],
        optionalKeys: auth?.data?.optionalKeys || [],
      },
    }));
  }, [auth, isAuthSuccess, pubkey]);

  const {
    data: validators,
    isLoading: isValidatorsLoading,
    isSuccess: isValidatorsSuccess,
  } = useValidators({ config: { params: { address } } });
  useEffect(() => {
    if (!isValidatorsSuccess) {
      return;
    }
    const validator = validators.data[0];
    setAccount((state) => ({
      ...state,
      summary: {
        ...state.summary,
        isValidator: !!validator?.name,
      },
      pos: {
        ...state.pos,
        validator: {
          username: validator?.name || '',
          consecutiveMissedBlocks: validator?.consecutiveMissedBlocks,
          lastGeneratedHeight: validator?.lastGeneratedHeight,
          isBanned: validator?.isBanned,
          totalStakeReceived: validator?.totalStakeReceived,
        },
      },
    }));
  }, [validators, isValidatorsSuccess]);

  // Cross check other query params limit as well
  const {
    data: unlocks,
    isLoading: isUnlocksLoading,
    isSuccess: isUnlocksSuccess,
  } = useUnlocks({ config: { params: { address, limit: 100 } } });
  useEffect(() => {
    if (!isUnlocksSuccess) {
      return;
    }
    setAccount((state) => ({
      ...state,
      pos: {
        ...state.pos,
        pendingUnlocks: unlocks?.data?.pendingUnlocks ?? [],
      },
    }));
  }, [unlocks, isUnlocksSuccess]);

  const {
    data: legacy,
    isLoading: isLegacyLoading,
    isSuccess: isLegacySuccess,
  } = useLegacy({
    config: { params: { publicKey: pubkey } },
    options: { enabled: !!pubkey },
  });
  useEffect(() => {
    if (!isLegacySuccess) {
      return;
    }
    setAccount((state) => ({
      ...state,
      summary: {
        ...state.summary,
        isMigrated: legacy?.data?.balance === '0',
        legacyAddress: legacy?.data?.legacyAddress,
      },
      ...(legacy?.data && {
        legacy: {
          address: legacy.data.legacyAddress,
          balance: legacy.data.balance,
        },
      }),
    }));
  }, [legacy, isLegacySuccess]);

  const {
    data: token,
    isLoading: isTokenLoading,
    isSuccess: isTokenSuccess,
  } = useTokenBalances({ config: { params: { address } } });
  useEffect(() => {
    if (!isTokenSuccess) {
      return;
    }
    setAccount((state) => ({
      ...state,
      token: token?.data,
    }));
  }, [token, isTokenSuccess]);

  useEffect(() => {
    dispatch({
      type: authActionTypes.accountUpdated,
      data: { LSK: account },
    });
  }, [account]);

  return {
    isLoading:
      isAuthLoading ||
      isValidatorsLoading ||
      isUnlocksLoading ||
      isSentStakesLoading ||
      isLegacyLoading ||
      isTokenLoading,
    isSuccess:
      isAuthSuccess &&
      isValidatorsSuccess &&
      isUnlocksSuccess &&
      isSentStakesSuccess &&
      isLegacySuccess &&
      isTokenSuccess,
  };
};
