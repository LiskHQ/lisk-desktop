import React, { useEffect, useState } from 'react';

import { parseSearchParams } from '@common/utilities/searchParams';
import Piwik from '@common/utilities/piwik';
import { AutoResizeTextarea } from '@views/basics/inputs';
import { PrimaryButton } from '@views/basics/buttons';
import Box from '@views/basics/box';
import Tooltip from '@views/basics/tooltip/tooltip';
import BoxContent from '@views/basics/box/content';
import BoxFooter from '@views/basics/box/footer';
import BoxInfoText from '@views/basics/box/infoText';
import styles from '../signMessage.css';

const Form = ({
  nextStep,
  t,
  history,
  onNext,
  prevState,
}) => {
  const [message, setMessage] = useState(prevState?.message || '');
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
