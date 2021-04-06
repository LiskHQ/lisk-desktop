import React, { useEffect, useState } from 'react';

import { parseSearchParams } from '@utils/searchParams';
import Piwik from '@utils/piwik';
import { AutoResizeTextarea } from '@toolbox/inputs';
import { PrimaryButton } from '@toolbox/buttons';
import Box from '@toolbox/box';
import Tooltip from '@toolbox/tooltip/tooltip';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import BoxHeader from '@toolbox/box/header';
import BoxInfoText from '@toolbox/box/infoText';
import styles from './signMessage.css';

const SignMessageInput = ({ nextStep, t, history }) => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const params = parseSearchParams(history.location.search);
    if (typeof params.message === 'string' && params.message.length) {
      setMessage(params.message);
    }
  }, []);

  const onChange = ({ target: { value } }) => {
    setMessage(value);
  };

  const onClick = () => {
    Piwik.trackingEvent('SignMessageInput', 'button', 'Next step');
    nextStep({ message });
  };

  return (
    <Box>
      <BoxHeader>
        <h1>{t('Sign a message')}</h1>
      </BoxHeader>
      <BoxContent className={styles.noPadding}>
        <BoxInfoText>
          <span>{t('The sign message tool allows you to prove ownership of a transaction')}</span>
          <Tooltip className={styles.tooltip} position="bottom">
            <p>{t('Recipients will be able to confirm the transfer  by viewing the signature which verifies the ownership without exposing any sensitive account information.')}</p>
          </Tooltip>
        </BoxInfoText>
        <label className={styles.fieldGroup}>
          <span>{t('Message')}</span>
          <AutoResizeTextarea
            className={styles.textarea}
            name="message"
            onChange={onChange}
            value={message}
          />
        </label>
      </BoxContent>
      <BoxFooter direction="horizontal">
        <PrimaryButton className="next" onClick={onClick}>
          {t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};


export default SignMessageInput;
