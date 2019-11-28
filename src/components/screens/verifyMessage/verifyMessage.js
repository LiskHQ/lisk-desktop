import PropTypes from 'prop-types';
import React from 'react';
import MultiStep from '../../shared/multiStep';
import PageLayout from '../../toolbox/pageLayout';
import Result from './result';
import VerifyMessageInput from './verifyMessageInput';
import routes from '../../../constants/routes';

export default function VerifyMessage({
  t, history,
}) {
  function finalCallback() {
    history.push(routes.dashboard.path);
  }

  return (
    <PageLayout width="medium" verticalAlign="middle">
      <MultiStep finalCallback={finalCallback}>
        <VerifyMessageInput t={t} history={history} />
        <Result t={t} />
      </MultiStep>
    </PageLayout>
  );
}

VerifyMessage.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
