import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';

import RemoveConfirmation from '@account/components/RemoveConfirmation';
import RemoveSuccess from '@account/components/RemoveSuccess/RemoveSuccess';
import routes from 'src/routes/routes';
import MultiStep from 'src/modules/common/components/MultiStep';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { useAccounts } from '../../hooks';
import styles from './RemoveAccount.css';

const RemoveAccount = ({ account }) => {
  const history = useHistory();
  const { deleteAccountByAddress } = useAccounts();
  const multiStepRef = useRef(null);

  const onRemoveAccount = () => {
    const removeAddress = account?.metadata?.address;
    deleteAccountByAddress(removeAddress);
    multiStepRef.current.next();
  };

  const onComplete = () => {
    history.push(routes.manageAccounts.path);
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <MultiStep ref={multiStepRef}>
          <RemoveConfirmation account={account} onRemoveAccount={onRemoveAccount} />
          <RemoveSuccess onComplete={onComplete} />
        </MultiStep>
      </BoxContent>
    </Box>
  );
};

export default RemoveAccount;
