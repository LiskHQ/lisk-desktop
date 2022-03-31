import React from 'react'
import settingConstants from "@settings/configuration/settingConstants";
import Toggle from "./toggle";

function DiscreateModeToggle({ t }){
    return ( 
        <Toggle
            setting={settingConstants.keys.discreetMode}
            icons={['discreetModeActive', 'discreetMode']}
            tips={[t('Disable discreet mode'), t('Enable discreet mode')]}
        />
    )
}

export default DiscreateModeToggle