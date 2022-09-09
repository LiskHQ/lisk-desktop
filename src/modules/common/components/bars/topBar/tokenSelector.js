import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsUpdated } from 'src/redux/actions';
import routes from 'src/routes/routes';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { selectActiveToken } from 'src/redux/selectors';
import styles from './topBar.css';

const TokenSelector = ({ token, history, t, disabled }) => {
  const dispatch = useDispatch();
  const activeToken = useSelector(selectActiveToken);

  const activateToken = () => {
    if (activeToken !== token && history.location.pathname !== routes.reclaim.path) {
      dispatch(settingsUpdated({ token: { active: token } }));
      const { location, push } = history;
      if (location.pathname !== routes.wallet.path) {
        push(routes.wallet.path);
      }
    }
  };

  return (
    <Tooltip
      className={`${styles.tokenSelector} ${disabled && `${styles.disabled} disabled`}`}
      size="maxContent"
      position="bottom"
      content={
        <Icon
          name={`${token.toLowerCase()}Icon`}
          className={`${styles.toggle} ${
            activeToken !== token ? styles.opaqueLogo : ''
          } token-selector-${token}`}
          onClick={activateToken}
        />
      }
    >
      <p>{t('Lisk wallet')}</p>
    </Tooltip>
  );
};

export default TokenSelector;
