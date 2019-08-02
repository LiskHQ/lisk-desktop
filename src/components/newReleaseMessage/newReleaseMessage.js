import React from 'react';
import FlashMessage from '../toolbox/flashMessage/flashMessage';

const NewReleaseMessage = ({ t = v => v }) => (
  <FlashMessage
    linkCaption={t('Read more')}
    shouldShow
  >
    <FlashMessage.Content>
      <strong>Lisk Hub 1.18.0 is out.</strong>
      This version includes the Trezor Model T hardware wallet support among other features.
    </FlashMessage.Content>
  </FlashMessage>
);

export default NewReleaseMessage;
