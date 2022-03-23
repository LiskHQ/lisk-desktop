import PropTypes from 'prop-types';
import React from 'react';

import routes from '@screens/router/routes';
import MultiStep from '@shared/multiStep';
import Dialog from '@basics/dialog/dialog';
import Result from './result';
import VerifyMessageInput from './verifyMessageInput';
import styles from './verifyMessage.css';

export default function VerifyMessage({
  t, history,
}) {
  function finalCallback() {
    history.push(routes.dashboard.path);
  }

  return (
    <Dialog hasClose className={styles.wrapper}>
      <MultiStep finalCallback={finalCallback}>
        <VerifyMessageInput t={t} history={history} />
        <Result t={t} history={history} />
      </MultiStep>
    </Dialog>
  );
}

VerifyMessage.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
