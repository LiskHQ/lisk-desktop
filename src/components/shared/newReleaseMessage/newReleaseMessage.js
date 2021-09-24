import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTheme } from '@utils/theme';
import FlashMessage from '@toolbox/flashMessage/flashMessage';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './newReleaseMessage.css';

const NewReleaseMessage = ({
  t,
  version = '2.0.3',
  releaseSummary = 'This version improves the overall usability and responsiveness of the application UI.',
  updateNow = () => {},
  readMore = () => {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <FlashMessage shouldShow hasCloseAction={false} {...props}>
      <FlashMessage.Content>
        <div className={styles.container}>
          <Icon name="warningFolder" />
          {t('Lisk {{version}}', { version })}
          {t(' is out. ')}
          {releaseSummary}
          <div className={styles.btnContainer}>
            <SecondaryButton
              className={`${styles.button} ${theme === 'dark' ? theme : ''}`}
              size="s"
              onClick={updateNow}
            >
              {t('Update now')}
            </SecondaryButton>
            <PrimaryButton
              className={`${styles.button} ${styles.primary} ${theme}`}
              size="s"
              onClick={readMore}
            >
              {t('Read more')}
            </PrimaryButton>
          </div>
        </div>
      </FlashMessage.Content>
    </FlashMessage>
  );
};

NewReleaseMessage.propTypes = {
  version: PropTypes.string.isRequired,
  releaseSummary: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  updateNow: PropTypes.func.isRequired,
  readMore: PropTypes.func.isRequired,
};

export default withTranslation()(NewReleaseMessage);
