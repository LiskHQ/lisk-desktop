import React from 'react';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import { transactions } from '@liskhq/lisk-client';
import { moduleAssetSchemas, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { createTransactionObject } from '@utils/transaction';
import { transactionBroadcasted } from '@actions';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import BoxFooter from '@toolbox/box/footer';
import BoxContent from '@toolbox/box/content';
import Box from '@toolbox/box';
import TransactionDetails from '@screens/transactionDetails/transactionDetails';
import ProgressBar from '../progressBar';
import styles from '../styles.css';

// eslint-disable-next-line max-statements
const flattenTransaction = ({ moduleAssetId, asset, ...rest }) => {
  const transaction = {
    senderPublicKey: rest.sender.publicKey,
    nonce: rest.nonce,
    moduleAssetId,
    fee: rest.fee,
    signatures: rest.signatures.map(sig => Buffer.from(sig, 'hex')),
  };

  switch (moduleAssetId) {
    case MODULE_ASSETS_NAME_ID_MAP.transfer: {
      transaction.recipientAddress = asset.recipient.address;
      transaction.amount = asset.amount;
      transaction.data = asset.data;
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.voteDelegate:
      transaction.votes = asset.votes;
      break;

    case MODULE_ASSETS_NAME_ID_MAP.registerDelegate:
      transaction.username = asset.username;
      break;

    case MODULE_ASSETS_NAME_ID_MAP.unlockToken:
      transaction.unlockObjects = asset.unlockObjects;
      break;

    case MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup: {
      transaction.numberOfSignatures = asset.numberOfSignatures;
      transaction.mandatoryKeys = asset.mandatoryKeys;
      transaction.optionalKeys = asset.optionalKeys;
      break;
    }

    default:
      break;
  }

  return transaction;
};

const getNumbersOfSignaturesRequired = ({ keys, isGroupRegistration }) => {
  if (isGroupRegistration) {
    // +1 to account for double sender signature
    return keys.mandatoryKeys.length + keys.optionalKeys.length + 1;
  }
  return keys.numberOfSignatures;
};

const getKeys = ({ senderAccount, transaction, isGroupRegistration }) => {
  if (isGroupRegistration) {
    return transaction.asset;
  }

  return senderAccount.keys;
};

const getOwnSignatureIndex = ({ keys, publicKey, isGroupRegistration }) => {
  const ownIndex = [
    ...keys.mandatoryKeys,
    ...keys.optionalKeys,
  ].findIndex(key => key === publicKey);

  if (isGroupRegistration) {
    return ownIndex + 1;
  }
  return ownIndex;
};

const getNonEmptySignatures = (signatures) =>
  signatures.filter(signature => Boolean(signature));

const ReviewSign = ({
  t,
  transaction,
  account,
  networkIdentifier,
  nextStep,
  history,
  error,
  dispatch,
  senderAccount,
}) => {
  // eslint-disable-next-line max-statements
  const showSendButton = () => {
    if (senderAccount.data?.keys) {
      const isGroupRegistration = transaction.moduleAssetId
        === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;
      const keys = getKeys({
        senderAccount: senderAccount.data, transaction, isGroupRegistration,
      });

      const required = getNumbersOfSignaturesRequired({
        keys, transaction, isGroupRegistration,
      });

      const alreadySigned = getNonEmptySignatures(transaction.signatures).length;

      // +1 to add the signature that this account will add by clicking "Sign and Send"
      if (required === alreadySigned + 1) {
        const publicKey = account.info.LSK.summary.publicKey;

        const index = getOwnSignatureIndex({
          keys, publicKey, isGroupRegistration,
        });

        const hasCurrentAccountSigned = Boolean(transaction.signatures[index]);

        if (!hasCurrentAccountSigned) {
          return true;
        }
        return false;
      }

      return false;
    }
    return false;
  };

  // eslint-disable-next-line max-statements
  const signTransaction = () => {
    let signedTransaction;
    let err;

    const isGroupRegistration = transaction.moduleAssetId
        === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

    const { mandatoryKeys, optionalKeys } = getKeys({
      senderAccount: senderAccount.data, transaction, isGroupRegistration,
    });

    const flatTransaction = flattenTransaction(transaction);
    const transactionObject = createTransactionObject(flatTransaction, transaction.moduleAssetId);
    const keys = {
      mandatoryKeys: mandatoryKeys.map(key => Buffer.from(key, 'hex')),
      optionalKeys: optionalKeys.map(key => Buffer.from(key, 'hex')),
    };

    const includeSender = transaction.moduleAssetId
      === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

    try {
      signedTransaction = transactions.signMultiSignatureTransaction(
        moduleAssetSchemas[transaction.moduleAssetId],
        transactionObject,
        Buffer.from(networkIdentifier, 'hex'),
        account.passphrase,
        keys,
        includeSender,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      err = e;
    }

    return [signedTransaction, err];
  };

  const onSignClick = () => {
    const [signedtx, err] = signTransaction();
    nextStep({ transaction: signedtx, error: err });
  };

  const onSendClick = () => {
    const [signedtx, err] = signTransaction();
    dispatch(transactionBroadcasted(signedtx));
    nextStep({ transaction: signedtx, isBroadcasted: true, error: err });
  };

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={2} />
          <TransactionDetails
            t={t}
            activeToken="LSK"
            schema={`${transaction.moduleAssetId}-preview`}
            account={senderAccount.data}
            transaction={{
              data: transaction,
              error,
            }}
          />
        </BoxContent>
        <BoxFooter
          direction="horizontal"
          className={styles.footer}
        >
          <SecondaryButton size="l" onClick={() => removeSearchParamsFromUrl(history, ['modal'])}>
            {t('Reject')}
          </SecondaryButton>
          <PrimaryButton size="l" onClick={onSignClick}>
            {t('Sign')}
          </PrimaryButton>
          {showSendButton() && (
            <PrimaryButton size="l" onClick={onSendClick}>
              {t('Sign and Send')}
            </PrimaryButton>
          )}
        </BoxFooter>
      </Box>
    </section>
  );
};
export default ReviewSign;
