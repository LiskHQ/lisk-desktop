import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import settingConstants from '@settings/const/settingConstants';
import useSettings from '@settings/hooks/useSettings';
import Tooltip from '@theme/Tooltip';
import Icon from '@theme/Icon';
import styles from './SidebarToggle.css';

const sideBarExpanded = settingConstants.keys.sideBarExpanded;

function SidebarToggle() {
  const { t } = useTranslation();
  const { toggleSetting, [sideBarExpanded]: isExpanded } = useSettings(sideBarExpanded);

  const toggle = () => {
    toggleSetting(!isExpanded);
  };

  return (
    <Tooltip
      className={classNames(styles.SidebarToggle, isExpanded && styles.isExpanded)}
      size="maxContent"
      position="bottom"
      content={
        <Icon
          className={classNames(styles.SidebarToggleImg, isExpanded && styles.isExpanded)}
          name={isExpanded ? 'arrowLeft' : 'arrowRight'}
          onClick={toggle}
          data-testid="Icon"
        />
      }
    >
      <p>{isExpanded ? t('Collapse sidebar') : t('Expand sidebar')}</p>
    </Tooltip>
  );
}

export default SidebarToggle;
