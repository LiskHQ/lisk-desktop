import React, { useRef, useCallback, useState, useEffect } from 'react';
import { withRouter } from 'react-router';

import RemoveConfirmation from '@account/components/RemoveConfirmation/RemoveConfirmation';
import RemoveSuccess from '@account/components/RemoveSuccess/RemoveSuccess';
import routes from 'src/routes/routes';
import MultiStep from 'src/modules/common/components/MultiStep';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { useAccounts } from '../../hooks';
import styles from './RemoveAccount.css';

const RemoveAccount = ({ address, history }) => {
  const { deleteAccountByAddress, getAccountByAddress } = useAccounts();
  const [account, setAccount] = useState(null);
  const multiStepRef = useRef(null);

  useEffect(() => {
    const acc = getAccountByAddress(address);
    setAccount(acc);
  }, [address]);

  const removeAccount = useCallback(
    (removeAddress) => {
      // istanbul ignore next
      if (removeAddress) {
        deleteAccountByAddress(removeAddress);
      }
    },
    [deleteAccountByAddress]
  );

  const onRemoveAccount = () => {
    removeAccount(address);
    multiStepRef.current.next();
  };

  const onComplete = () => {
    history.push(routes.manageAccounts.path);
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <MultiStep navStyles={{ multiStepWrapper: styles.wrapper }} ref={multiStepRef}>
          <RemoveConfirmation account={account} onRemoveAccount={onRemoveAccount} />
          <RemoveSuccess onComplete={onComplete} />
        </MultiStep>
      </BoxContent>
    </Box>
  );
};

export default withRouter(RemoveAccount);
