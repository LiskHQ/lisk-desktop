import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import FlashMessage from 'src/theme/flashMessage/flashMessage';

const AnalyticsMessage = ({ t, history }) => (
  <FlashMessage shouldShow hasCloseAction={false}>
    <FlashMessage.Content
      link={{
        label: t('Read more'),
        action: () => addSearchParamsToUrl(history, { modal: 'analytics' }),
      }}
    >
      {t('Opt-in to sharing anonymous data in order to improve Lisk.')}
    </FlashMessage.Content>
  </FlashMessage>
);

AnalyticsMessage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(withRouter(AnalyticsMessage));
