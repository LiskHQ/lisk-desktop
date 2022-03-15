import React from 'react';
import { useDispatch } from 'react-redux';
import { routes } from '@constants';
import Icon from '@toolbox/icon';
import Tooltip from '@toolbox/tooltip/tooltip';
import Piwik from '@utils/piwik';
import { accountLoggedOut } from '@actions';
import styles from './topBar.css';

const SignOut = ({ t, history }) => {
  const dispatch = useDispatch();

  const signOut = () => {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    dispatch(accountLoggedOut());
    history.replace(`${routes.login.path}`);
  };

  return (
    <Tooltip
      className={styles.logoutTooltipWrapper}
      size="maxContent"
      position="bottom"
      content={(
        <span className={`${styles.logoutBtn} logoutBtn`} onClick={signOut}>
          <Icon name="signOut" className={styles.icon} />
        </span>
      )}
    >
      <p>{t('Sign out')}</p>
    </Tooltip>
  );
};

export default SignOut;
