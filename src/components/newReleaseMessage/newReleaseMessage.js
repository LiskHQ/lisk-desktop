import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import FlashMessage from '../toolbox/flashMessage/flashMessage';
import { TertiaryButton } from '../toolbox/buttons/button';
import styles from './newReleaseMessage.css';

const NewReleaseMessage = ({
  t,
  version,
  releaseNotes,
  releaseSummary,
  onClick,
  ...props
}) => (
  <FlashMessage shouldShow {...props}>
    <FlashMessage.Content>
      <React.Fragment>
        <strong>{t('Lisk Hub {{version}}', { version })}</strong>
        {t(' is out. ')}
        {releaseSummary}
        <TertiaryButton
          className={`${styles.button} small`}
          onClick={onClick}
        >
          {t('Read more')}
        </TertiaryButton>
      </React.Fragment>
    </FlashMessage.Content>
  </FlashMessage>
);

NewReleaseMessage.propTypes = {
  version: PropTypes.string.isRequired,
  releaseNotes: PropTypes.string.isRequired,
  releaseSummary: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default translate()(NewReleaseMessage);
