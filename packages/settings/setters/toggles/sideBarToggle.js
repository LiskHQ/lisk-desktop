import React from 'react'
import settingConstants from "@settings/configuration/settingConstants";
import Toggle from "./toggle";

function SideBarToggle(){
    return ( 
        <Toggle
            setting={settingConstants.keys.sideBarExpanded}
            icons={['discreetModeActive', 'discreetMode']}
            tips={[t('Disable discreet mode'), t('Enable discreet mode')]}
        />
    )
}

export default SideBarToggle