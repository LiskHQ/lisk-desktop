import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseSearchParams } from 'src/utils/searchParams';
import Piwik from 'src/utils/piwik';
import { AutoResizeTextarea } from 'src/theme';
import { PrimaryButton } from 'src/theme/buttons';
import Box from 'src/theme/box';
import Tooltip from 'src/theme/Tooltip';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import BoxInfoText from 'src/theme/box/infoText';
import styles from './messageForm.css';

const Form = ({ nextStep, history, onNext, prevState, signMessage }) => {
  const [message, setMessage] = useState(prevState?.message || '');
  const { t } = useTranslation();

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
    nextStep({
      message,
      actionFunction: (formProps, _, privateKey) => signMessage({ message, nextStep, privateKey }),
    });
    onNext?.();
  };

  return (
    <Box className={styles.messageWrapper}>
      <BoxContent className={styles.noPadding}>
        <BoxInfoText>
          <span>{t('Sign a message to prove its integrity')}</span>
          <Tooltip className={styles.tooltip} position="bottom">
            <p>
              {t(
                'To verify the integrity of a signed message use the "Verify message" tool in the sidebar.'
              )}
            </p>
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
