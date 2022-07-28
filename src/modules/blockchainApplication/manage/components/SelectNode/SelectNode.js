import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import useApplicationManagement from '../../hooks/useApplicationManagement';
import useCurrentNode from '../../hooks/useCurrentNode';
import styles from './SelectNode.css';

const NodeComponent = ({ node, selectAppNode }) => (
  <div className={grid['col-xs-6']} onClick={() => selectAppNode(node)} data-testid="application-node-row">
    <div className={styles.node}>
      {node.rest}
      <Icon name="arrowRightActive" color="red" />
    </div>
  </div>
);

const SelectNode = ({ history, location }) => {
  const { t } = useTranslation();
  const chainId = parseSearchParams(location.search).chainId;
  const { getApplicationByChainId } = useApplicationManagement();
  const { setCurrentNode } = useCurrentNode();
  const application = getApplicationByChainId(chainId);
  const chainLogo = null;

  const selectAppNode = (node) => {
    setCurrentNode(node);
    removeSearchParamsFromUrl(history, ['modal', 'chainId']);
  };

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
              <NodeComponent node={node} key={node.rpc} selectAppNode={selectAppNode} />
            ))}
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default SelectNode;
