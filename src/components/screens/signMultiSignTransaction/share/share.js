import React, { useEffect, useState } from 'react';
import { downloadJSON } from '@utils/helpers';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import CopyToClipboard from '@toolbox/copyToClipboard';
import Icon from '@toolbox/icon';
import TransactionResult from '@shared/transactionResult';
import { transactions } from '@liskhq/lisk-client';
import { moduleAssetSchemas, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { createTransactionObject } from '@utils/transaction';
import { transactionBroadcasted } from '@actions';
import ProgressBar from '../progressBar';
import styles from './styles.css';

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

    default:
      break;
  }

  return transaction;
};

const Share = ({
  t, transaction, error, networkIdentifier, account, dispatch,
}) => {
  const [signedTransaction, setSignedTransaction] = useState();
  const success = !error && transaction;
  const template = success ? {
    illustration: 'registerMultisignatureSuccess',
    message: t('You have successfully signed the transaction. You can download or copy the transaction and send it back to the initiator.'),
  } : {
    illustration: 'registerMultisignatureError',
    message: t(`Error: ${error}`),
  };

  const onDownload = () => {
    downloadJSON(transaction, transaction.id);
  };

  useEffect(() => {
    const { mandatoryKeys, optionalKeys } = account.info.LSK.keys;
    const flatTransaction = flattenTransaction(transaction);
    const transactionObject = createTransactionObject(flatTransaction, transaction.moduleAssetId);
    const keys = {
      mandatoryKeys: mandatoryKeys.map(key => Buffer.from(key, 'hex')),
      optionalKeys: optionalKeys.map(key => Buffer.from(key, 'hex')),
    };

    const includeSender = transaction.moduleAssetId
      === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

    try {
      const tx = transactions.signMultiSignatureTransaction(
        moduleAssetSchemas[transaction.moduleAssetId],
        transactionObject,
        Buffer.from(networkIdentifier, 'hex'),
        account.passphrase,
        keys,
        includeSender,
      );

      setSignedTransaction(tx);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, []);

  const broadcastTransaction = () => {
    if (signedTransaction) {
      dispatch(transactionBroadcasted(signedTransaction));
    }
  };

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Register multisignature account')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={4} />
          <TransactionResult
            t={t}
            illustration={template.illustration}
            success={success}
            message={template.message}
            className={styles.content}
            error={error}
          />
        </BoxContent>
        {success && (
          <BoxFooter className={styles.footer} direction="horizontal">
            <CopyToClipboard
              Container={SecondaryButton}
              text={t('Copy')}
              className={styles.buttonContent}
              value={JSON.stringify(transaction)}
            />
            <PrimaryButton onClick={onDownload}>
              <span className={styles.buttonContent}>
                <Icon name="download" />
                {t('Download')}
              </span>
            </PrimaryButton>
            <PrimaryButton onClick={broadcastTransaction}>
              {t('Send')}
            </PrimaryButton>
          </BoxFooter>
        )}
      </Box>
    </section>
  );
};

export default Share;
