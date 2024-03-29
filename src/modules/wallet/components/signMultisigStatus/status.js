import React from 'react';
import { useSelector } from 'react-redux';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { useCurrentAccount } from '@account/hooks';
import DialogLink from '@theme/dialog/link';
import { useValidators } from '@pos/validator/hooks/queries';
import {
  statusMessages,
  getTransactionStatus,
  isTxStatusError,
} from '@transaction/configuration/statusConfig';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import { joinModuleAndCommand } from '@transaction/utils';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { selectModuleCommandSchemas } from 'src/redux/selectors';
import { shouldShowBookmark } from 'src/modules/common/constants';
import { PrimaryButton } from 'src/theme/buttons';
import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';
import { useMultiSignatureStatus } from '../../hooks/useMultiSignatureStatus';

// eslint-disable-next-line max-statements
const Status = ({ transactions, t, transactionJSON, reset, bookmarks, account, token }) => {
  const [currentAccount] = useCurrentAccount();
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);

  // This is to replace previous withData implementations.
  const { txInitiatorAccount } = useTxInitiatorAccount({
    senderPublicKey: transactionJSON.senderPublicKey,
  });
  const { mandatoryKeys, optionalKeys, numberOfSignatures, publicKey } = txInitiatorAccount;
  const isMultisignature =
    transactions.signedTransaction.params?.numberOfSignatures > 0 || numberOfSignatures > 0;
  const { data: validators } = useValidators({
    config: { params: { address: transactionJSON.params.recipientAddress } },
  });
  const validator = validators?.data?.[0];

  const { canSenderSignTx } = useMultiSignatureStatus({
    transactions,
    transactionJSON,
    moduleCommandSchemas,
    currentAccount,
    senderAccount: txInitiatorAccount,
    account: {
      mandatoryKeys,
      optionalKeys,
      numberOfSignatures,
      summary: {
        publicKey,
      },
    },
  });

  const status = getTransactionStatus(txInitiatorAccount, transactions, {
    moduleCommandSchemas,
    isMultisignature,
    canSenderSignTx,
  });

  const moduleCommand = joinModuleAndCommand(transactionJSON);

  const isBroadcastError = isTxStatusError(status.code);
  const showBookmark =
    !isBroadcastError &&
    shouldShowBookmark(bookmarks, account, transactionJSON, token) &&
    moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer;
  const template = statusMessages(t)[status.code];

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>
            {t(
              'If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.'
            )}
          </p>
        </header>
        <BoxContent>
          <ProgressBar current={4} />
          <TxBroadcaster
            message={template.message}
            title={template.title}
            illustration="signMultisignature"
            className={styles.content}
            status={status}
            reset={reset}
          >
            {showBookmark ? (
              <div className={`${styles.bookmarkBtn} bookmark-container`}>
                <DialogLink
                  component="addBookmark"
                  data={{
                    formAddress: transactionJSON.params.recipientAddress,
                    label: validator?.name ?? '',
                    isValidator: !!validator,
                  }}
                >
                  <PrimaryButton className={`${styles.btn} bookmark-btn`}>
                    {t('Add address to bookmarks')}
                  </PrimaryButton>
                </DialogLink>
              </div>
            ) : null}
          </TxBroadcaster>
        </BoxContent>
      </Box>
    </section>
  );
};

export default Status;
