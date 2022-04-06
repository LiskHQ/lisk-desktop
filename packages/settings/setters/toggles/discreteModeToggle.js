import React from 'react';
import settingConstants from '@settings/configuration/settingConstants';
import Toggle from './toggle';

function DiscreteModeToggle({ t }) {
  return (
    <Toggle
      setting={settingConstants.keys.discreetMode}
      icons={['discreetModeActive', 'discreetMode']}
      tips={[t('Disable discreet mode'), t('Enable discreet mode')]}
    />
  );
}

export default DiscreteModeToggle;
