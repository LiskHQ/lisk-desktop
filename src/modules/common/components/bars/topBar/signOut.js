import React from 'react';
import routes from 'src/routes/routes';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import Piwik from 'src/utils/piwik';
import styles from './topBar.css';

const SignOut = ({ t, history }) => {

  const signOut = () => {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
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
