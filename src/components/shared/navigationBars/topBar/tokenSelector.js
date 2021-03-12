import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import routes from 'constants';
import { settingsUpdated } from 'actions';
import { tokenMap } from 'constants';
import styles from './topBar.css';
import Icon from '../../../toolbox/icon';
import Tooltip from '../../../toolbox/tooltip/tooltip';

const TokenSelector = ({ token, history, t }) => {
  const dispatch = useDispatch();
  const activeToken = useSelector(state => state.settings.token.active);

  const activateToken = () => {
    if (activeToken !== token) {
      dispatch(settingsUpdated({ token: { active: token } }));
      const { location, push } = history;
      if (location.pathname !== routes.wallet.path) {
        push(routes.wallet.path);
      }
    }
  };

  return (
    <Tooltip
      className={styles.tooltipWrapper}
      size="maxContent"
      position="bottom"
      content={(
        <Icon
          name={`${token.toLowerCase()}Icon`}
          className={`${styles.toggle} token-selector-${token} ${activeToken === token ? '' : styles.disabled}`}
          onClick={activateToken}
        />
      )}
    >
      <p>{t(`${token === tokenMap.LSK.key ? 'Lisk' : 'Bitcoin'} wallet`)}</p>
    </Tooltip>
  );
};

export default TokenSelector;
