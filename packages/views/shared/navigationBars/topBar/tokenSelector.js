import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsUpdated } from '@common/store/actions';
import routes from '@screens/router/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import styles from './topBar.css';

const TokenSelector = ({
  token, history, t, disabled,
}) => {
  const dispatch = useDispatch();
  const activeToken = useSelector(state => state.settings.token.active);

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
      content={(
        <Icon
          name={`${token.toLowerCase()}Icon`}
          className={`${styles.toggle} ${activeToken !== token ? styles.opaqueLogo : ''} token-selector-${token}`}
          onClick={activateToken}
        />
      )}
    >
      <p>{t(`${token === tokenMap.LSK.key ? 'Lisk' : 'Bitcoin'} wallet`)}</p>
    </Tooltip>
  );
};

export default TokenSelector;
