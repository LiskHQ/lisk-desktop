import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FlashMessage from '@toolbox/flashMessage/flashMessage';
import { TertiaryButton } from '@toolbox/buttons';
import styles from './newReleaseMessage.css';

const NewReleaseMessage = ({
  t,
  version,
  releaseSummary,
  updateNow,
  readMore,
  ...props
}) => (
  <FlashMessage shouldShow {...props}>
    <FlashMessage.Content>
      <strong>{t('Lisk {{version}}', { version })}</strong>
      {t(' is out. ')}
      {releaseSummary}
      <span> </span>
      <TertiaryButton
        className={styles.button}
        size="s"
        onClick={updateNow}
      >
        {t('Update now')}
      </TertiaryButton>
      <span>{` ${t('or')} `}</span>
      <TertiaryButton
        className={styles.button}
        size="s"
        onClick={readMore}
      >
        {t('Read more')}
      </TertiaryButton>
      <span>.</span>
    </FlashMessage.Content>
  </FlashMessage>
);

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
