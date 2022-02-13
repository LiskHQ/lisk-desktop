import React, { useEffect, useState } from 'react';

import { parseSearchParams } from '@utils/searchParams';
import Piwik from '@utils/piwik';
import { AutoResizeTextarea } from '@toolbox/inputs';
import { PrimaryButton } from '@toolbox/buttons';
import Box from '@toolbox/box';
import Tooltip from '@toolbox/tooltip/tooltip';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import BoxInfoText from '@toolbox/box/infoText';
import styles from '../signMessage.css';

const Form = ({
  nextStep,
  t,
  history,
  onNext,
  prevState,
}) => {
  const [message, setMessage] = useState(prevState.message || '');
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
    onNext?.();
  };
  return (
    <Box>
      <BoxContent className={styles.noPadding}>
        <BoxInfoText>
          <span>{t('Sign a message to prove its integrity')}</span>
          <Tooltip className={styles.tooltip} position="bottom">
            <p>{t('To verify the integrity of a signed message use the "Verify message" tool in the sidebar.')}</p>
          </Tooltip>
        </BoxInfoText>
        <label className={styles.fieldGroup}>
          <span>{t('Message')}</span>
          <AutoResizeTextarea
            className={`${styles.textarea} sign-message-input`}
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

export default Form;
