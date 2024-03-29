import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import { getLogo } from '@token/fungible/utils/helpers';
import { useApplicationManagement, useCurrentApplication } from '../../hooks';
import styles from './SelectNode.css';

const NodeComponent = ({ node, selectAppNode }) => (
  <div
    className={grid['col-xs-6']}
    onClick={() => selectAppNode(node)}
    data-testid="application-node-row"
  >
    <div className={`${styles.node} select-node-row`}>
      {node.http}
      <Icon name="arrowRightActive" color="red" />
    </div>
  </div>
);

const SelectNode = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const chainID = parseSearchParams(location.search).chainID;
  const [, setApplication] = useCurrentApplication();
  const { getApplicationByChainId } = useApplicationManagement();
  const application = getApplicationByChainId(chainID);

  const selectAppNode = (node) => {
    setApplication(application, node);
    removeSearchParamsFromUrl(history, ['modal', 'chainId']);
  };

  return (
    <Dialog hasBack hasClose className={styles.container}>
      <Box className={styles.wrapper}>
        <BoxHeader className={`${styles.header} application-header`}>
          <span>
            <img src={getLogo(application)} />
          </span>
          <span>{application.chainName}</span>
        </BoxHeader>
        <BoxContent className={styles.contentWrapper}>
          <div className={`${styles.content} application-content`}>
            {t('Choose application URL')}
          </div>
          <div className={grid.row}>
            {application.serviceURLs.map((node) => (
              <NodeComponent node={node} key={node.rpc} selectAppNode={selectAppNode} />
            ))}
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default SelectNode;
