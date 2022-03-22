import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsUpdated } from '@common/store/actions';
import Tooltip from '@toolbox/tooltip/tooltip';
import Icon from '@toolbox/icon';
import styles from './topBar.css';

/**
 * Toggles boolean values on store.settings
 *
 * @param {String} setting The key to update in store.settings
 * @param {Array} icons [activeIconName, normalIconName]
 * @param {Array} tips [activeTip, normalTip]
 */
const Toggle = ({
  setting, icons, tips,
}) => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.settings[setting]);

  const toggle = () => {
    dispatch(settingsUpdated({ [setting]: !value }));
  };

  return (
    <Tooltip
      className={styles.tooltipWrapper}
      size="maxContent"
      position="bottom"
      content={(
        <Icon
          name={value ? icons[0] : icons[1]}
          className={styles.toggle}
          onClick={toggle}
        />
      )}
    >
      <p>{value ? tips[0] : tips[1]}</p>
    </Tooltip>
  );
};

export default Toggle;
