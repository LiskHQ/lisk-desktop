import React from 'react';
import { useHistory } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import RemoveApplicationDetails from '../RemoveApplicationDetails';
import RemoveApplicationSuccess from '../RemoveApplicationSuccess';
import styles from './RemoveApplicationFlow.css';

const RemoveApplicationFlow = ({ testHistory, testLocation }) => {
  const history = useHistory();
  const handleCancelAppDetails = () => {
    removeSearchParamsFromUrl(history, ['modal', 'chainId'], true);
  };

  return (
    <div className={`${styles.removeApplicationFlowWrapper} ${grid.row}`}>
      <MultiStep navStyles={{ multiStepWrapper: styles.wrapper }}>
        <RemoveApplicationDetails
          history={testHistory}
          location={testLocation}
          onCancel={handleCancelAppDetails}
        />
        <RemoveApplicationSuccess />
      </MultiStep>
    </div>
  );
};

export default RemoveApplicationFlow;
