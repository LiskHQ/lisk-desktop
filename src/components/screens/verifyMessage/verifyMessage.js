import PropTypes from 'prop-types';
import React from 'react';
import MultiStep from '../../shared/multiStep';
import Result from './result';
import VerifyMessageInput from './verifyMessageInput';
import routes from '../../../constants/routes';
import styles from './verifyMessage.css';

export default function VerifyMessage({
  t, history,
}) {
  function finalCallback() {
    history.push(routes.dashboard.path);
  }

  return (
    <section className={styles.wrapper}>
      <MultiStep finalCallback={finalCallback}>
        <VerifyMessageInput t={t} history={history} />
        <Result t={t} />
      </MultiStep>
    </section>
  );
}

VerifyMessage.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
