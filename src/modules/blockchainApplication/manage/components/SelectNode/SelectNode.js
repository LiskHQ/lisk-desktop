import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { parseSearchParams } from 'src/utils/searchParams';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import useApplicationManagement from '../../hooks/useApplicationManagement';
import styles from './SelectNode.css';

const NodeComponent = ({ node }) => (
  <div className={grid['col-xs-6']}>
    <div className={styles.node}>
      {node.rest}
      <Icon name="arrowRightActive" color="red" />
    </div>
  </div>
);

const SelectNode = ({ location }) => {
  const { t } = useTranslation();
  const chainId = parseSearchParams(location.search).chainId;
  const { applications, getApplicationByChainId } = useApplicationManagement();
  // figure out how to deal with applications manage data and explore data
  // The data for the applications manage list is different from the data
  // from applications explore list. This enables the user to add an application
  // and have it show up on the manage list. However, getApplicationByChainId
  // only gets applications from the applications manage list and therefore
  // can't get the application details of an application in the manage list
  console.log({ applications, chainId });
  const application = getApplicationByChainId(chainId);
  // console.log({ application });
  const chainLogo = null;
  return (
    <Dialog hasBack hasClose className={styles.container}>
      <Box className={styles.wrapper}>
        <BoxHeader className={styles.header}>
          <span>
            <img src={chainLogo || liskLogo} />
          </span>
          <span>
            {application.name}
          </span>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <div className={styles.contentHeader}>{t('Choose application URL')}</div>
          <div className={grid.row}>
            {application.apis.map((node) => (
              <NodeComponent node={node} key={node.rpc} />
            ))}
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default SelectNode;
