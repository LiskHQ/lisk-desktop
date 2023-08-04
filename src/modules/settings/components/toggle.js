import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Piwik from 'src/utils/piwik';
import CheckBox from 'src/theme/CheckBox';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import styles from 'src/modules/common/components/bars/topBar/topBar.css';
import useSettings from '../hooks/useSettings';

/**
 * Toggles boolean values on store.settings
 */
const Toggle = ({ setting, icons, tips, isCheckbox, className }) => {
  const { t } = useTranslation();
  const { toggleSetting, [setting]: value } = useSettings(setting);

  const toggle = () => {
    toggleSetting(!value);
  };

  const handleCheckboxChange = () => {
    Piwik.trackingEvent('Settings', 'button', 'Update settings');
    toggleSetting(value?.setting);
    toast(t('Settings saved!'));
  };

  return isCheckbox ? (
    <CheckBox
      name={setting}
      className={`${styles.checkbox} ${setting} ${className}`}
      checked={value}
      onChange={handleCheckboxChange}
    />
  ) : (
    <Tooltip
      className={`${styles.tooltipWrapper} ${className}`}
      size="maxContent"
      position="bottom"
      content={
        <Icon name={value ? icons[0] : icons[1]} className={styles.toggle} onClick={toggle} />
      }
    >
      <p>{value ? tips[0] : tips[1]}</p>
    </Tooltip>
  );
};

Toggle.defaultProps = {
  isChecked: false,
};

export default Toggle;
