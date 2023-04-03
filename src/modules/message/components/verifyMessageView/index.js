import PropTypes from 'prop-types';
import React from 'react';

import routes from 'src/routes/routes';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Dialog from 'src/theme/dialog/dialog';
import ValidityStatus from '../validityStatus';
import ValidityForm from '../validityForm';
import styles from './verifyMessageView.css';

export default function VerifyMessage({ t, history }) {
  function finalCallback() {
    history.push(routes.wallet.path);
  }

  return (
    <Dialog hasClose className={styles.wrapper}>
      <MultiStep finalCallback={finalCallback}>
        <ValidityForm t={t} history={history} />
        <ValidityStatus t={t} history={history} />
      </MultiStep>
    </Dialog>
  );
}

VerifyMessage.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
