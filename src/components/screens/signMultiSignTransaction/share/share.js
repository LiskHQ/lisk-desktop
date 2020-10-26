import React, { useState } from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import CopyToClipboard from '../../../toolbox/copyToClipboard';
import Icon from '../../../toolbox/icon';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const Share = ({
  t, error,
}) => {
  const [status] = useState(!error ? 'pending' : 'fail');
  const success = status !== 'fail';

  const template = success ? {
    illustration: 'registerMultisignatureSuccess',
    message: t('You have successfully signed the transaction. You can download or copy the transaction and send it back to the initiator.'),
  } : {
    illustration: 'registerMultisignatureError',
    message: t('Oops, looks like something went wrong.'),
  };

  return (
    <section>
      <Box className={styles.container}>
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
            error={JSON.stringify(error)}
          >
            {success && (
              <div className={styles.buttonsContainer}>
                <CopyToClipboard
                  Container={SecondaryButton}
                  text={t('Copy')}
                />
                <PrimaryButton>
                  <span>
                    <Icon name="download" />
                    {t('Download')}
                  </span>
                </PrimaryButton>
              </div>
            )}
          </TransactionResult>
        </BoxContent>
      </Box>
    </section>
  );
};

export default Share;
