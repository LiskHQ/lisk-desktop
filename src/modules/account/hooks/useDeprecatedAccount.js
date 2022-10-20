/* istanbul ignore file */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDelegates, useSentVotes, useUnlocks } from '@dpos/validator/hooks/queries';
import { useAuth } from '@auth/hooks/queries';
import { useLegacy } from '@legacy/hooks/queries';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import authActionTypes from '@auth/store/actionTypes';
import { useCurrentAccount } from './useCurrentAccount';

// eslint-disable-next-line max-statements, complexity
export const useDeprecatedAccount = () => {
  const [currentAccount] = useCurrentAccount();
  const dispatch = useDispatch();
  const { pubkey, address } = currentAccount.metadata;
  const [account, setAccount] = useState({
    summary: {
      address,
      publicKey: '',
      legacyAddress: '',
      // balance: @todo account has multiple balance now
      username: '',
      isMigrated: true,
      isDelegate: false,
      isMultisignature: false,
    },
    sequence: {
      nonce: '0',
    },
    keys: {
      numberOfSignatures: 0,
      mandatoryKeys: [],
      optionalKeys: [],
    },
    dpos: {
      delegate: {},
      sentVotes: [],
      unlocking: [],
    },
  });

  const {
    data: sentVotes,
    isLoading: isSentVotesLoading,
    isSuccess: isSentVotesSuccess,
  } = useSentVotes({ config: { params: { address } } });
  useEffect(() => {
    if (!isSentVotesSuccess) {
      return;
    }
    setAccount((state) => ({
      ...state,
      dpos: {
        ...state.dpos,
        sentVotes: sentVotes?.data?.votes || [],
      },
    }));
  }, [sentVotes, isSentVotesSuccess]);

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
        publicKey: auth?.meta?.publicKey || pubkey,
        username: auth?.meta?.name || '',
        isMultisignature: auth?.data?.numberOfSignatures > 1,
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
    data: delegates,
    isLoading: isDelegatesLoading,
    isSuccess: isDelegatesSuccess,
  } = useDelegates({ config: { params: { address } } });
  useEffect(() => {
    if (!isDelegatesSuccess) {
      return;
    }
    const delegate = delegates.data[0];
    setAccount((state) => ({
      ...state,
      summary: {
        ...state.summary,
        isDelegate: !!delegate?.name,
      },
      dpos: {
        ...state.dpos,
        delegate: {
          username: delegate?.name || '',
          consecutiveMissedBlocks: delegate?.consecutiveMissedBlocks,
          lastForgedHeight: delegate?.lastGeneratedHeight,
          isBanned: delegate?.isBanned,
          totalVotesReceived: delegate?.totalVotesReceived,
        },
      },
    }));
  }, [delegates, isDelegatesSuccess]);

  // TODO: For any given account maximum possible votes, unlocks is 10
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
      dpos: {
        ...state.dpos,
        unlocking: (unlocks?.data?.unlocking || []).map((unlock) => ({
          delegateAddress: unlock.delegateAddress,
          amount: unlock.amount,
          height: unlock.unvoteHeight,
        })),
      },
    }));
  }, [unlocks, isUnlocksSuccess]);

  const {
    data: legacy,
    isLoading: isLegacyLoading,
    isSuccess: isLegacySuccess,
  } = useLegacy({ config: { params: { publicKey: pubkey } } });
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
      ...(legacy?.data && {legacy: {
        address: legacy.data.legacyAddress,
        balance: legacy.data.balance,
      }}),
    }));
  }, [legacy, isLegacySuccess]);

  const {
    data: token,
    isLoading: isTokenLoading,
    isSuccess: isTokenSuccess,
  } = useTokensBalance({ config: { params: { address } } });
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
      isDelegatesLoading ||
      isUnlocksLoading ||
      isSentVotesLoading ||
      isLegacyLoading ||
      isTokenLoading,
    isSuccess:
      isAuthSuccess &&
      isDelegatesSuccess &&
      isUnlocksSuccess &&
      isSentVotesSuccess &&
      isLegacySuccess &&
      isTokenSuccess,
  };
};
