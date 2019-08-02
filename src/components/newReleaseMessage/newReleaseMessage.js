import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import regex from '../../utils/regex';
import FlashMessage from '../toolbox/flashMessage/flashMessage';
import { TertiaryButton } from '../toolbox/buttons/button';

const NewReleaseMessage = ({
  t,
  version,
  releaseNotes,
  onClick,
  ...props
}) => (
  <FlashMessage shouldShow {...props}>
    <FlashMessage.Content>
      <React.Fragment>
        <strong>{t('Lisk Hub {{version}}', { version })}</strong>
        {t(' is out. ')}
        {releaseNotes.match(regex.releaseSummary)[2] || ''}
        <TertiaryButton
          onClick={onClick}
        >
          {t('Read more')}
        </TertiaryButton>
      </React.Fragment>
    </FlashMessage.Content>
  </FlashMessage>
);

NewReleaseMessage.propTypes = {
  t: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
  releaseNotes: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default translate()(NewReleaseMessage);
