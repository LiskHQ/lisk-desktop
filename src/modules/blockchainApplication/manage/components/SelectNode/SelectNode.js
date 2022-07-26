import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import useApplicationManagement from '../../hooks/useApplicationManagement';
import styles from './SelectNode.css';

const SelectNode = ({ chainId }) => {
  const { t } = useTranslation();
  const { getApplicationByChainId } = useApplicationManagement();
  const application = getApplicationByChainId(chainId);
  const chainLogo = null;
  return (
    <Dialog hasBack hasClose>
      <Box className={styles.wrapper}>
        <BoxHeader>
          <img src={chainLogo || liskLogo} />
          {application.name}
        </BoxHeader>
        <BoxContent>
          <div>{t('Choose application URL')}</div>
          <div className={grid.row}>
            {application.apis.map((node) => (
              <div className={`${styles.node} grid['col-xs-6']`} key={node.rest}>{node.rest}</div>
            ))}
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default SelectNode;
