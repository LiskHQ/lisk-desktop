import React from 'react';
import Dialog from '@theme/dialog/dialog';
import BoxHeader from 'src/theme/box/header';
import Box from '@theme/box';

function SelectHardwareDeviceModal() {
  return (
    <Dialog>
      <Box>
        <BoxHeader>
          <h1>Switch account</h1>
        </BoxHeader>
      </Box>
    </Dialog>
  );
}

export default SelectHardwareDeviceModal;
