import React, { useState } from 'react';

import ReadMode from './readMode';
import EditMode from './editMode';

const CustomNode = ({
  t,
  settings,
  dropdownRef,
  customNetworkRemoved,
  networkSelected,
  customNetworkStored,
}) => {
  const [mode, setMode] = useState(settings.storedCustomNetwork ? 'read' : 'edit');

  if (mode === 'read') {
    return (
      <ReadMode
        storedCustomNetwork={settings.storedCustomNetwork}
        customNetworkRemoved={customNetworkRemoved}
        networkSelected={networkSelected}
        setMode={setMode}
        dropdownRef={dropdownRef}
      />
    );
  }
  return (
    <EditMode
      networkSelected={networkSelected}
      storedCustomNetwork={settings.storedCustomNetwork}
      customNetworkStored={customNetworkStored}
      setMode={setMode}
      dropdownRef={dropdownRef}
      t={t}
    />
  );
};

export default CustomNode;
