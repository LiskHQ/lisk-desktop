import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FlashMessage from '../toolbox/flashMessage/flashMessage';

const AnalyticsMessage = ({ t, onClick }) => (
  <FlashMessage shouldShow hasCloseAction={false}>
    <FlashMessage.Content
      link={{
        label: t('Read more'),
        action: onClick,
      }}
    >
      {t('Opt-in to sharing anonymous data in order to improve Lisk Hub.')}
    </FlashMessage.Content>
  </FlashMessage>
);

AnalyticsMessage.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(AnalyticsMessage);
