import React from 'react';
import { useTranslation } from 'react-i18next';
import settingConstants from '@settings/configuration/settingConstants';
import Toggle from './toggle';

function SideBarToggle() {
  const { t } = useTranslation();
  return (
    <Toggle
      setting={settingConstants.keys.sideBarExpanded}
      icons={['toggleSidebarActive', 'toggleSidebar']}
      tips={[t('Collapse sidebar'), t('Expand sidebar')]}
    />
  );
}

export default SideBarToggle;
