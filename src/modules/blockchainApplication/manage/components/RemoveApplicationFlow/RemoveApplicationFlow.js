/* eslint-disable max-lines */
import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import RemoveApplicationDetails from '../RemoveApplicationDetails';
import RemoveApplicationSuccess from '../RemoveApplicationSuccess/RemoveApplicationSuccess';
import styles from './RemoveApplicationFlow.css';

const RemoveApplicationFlow = () => {
  const multiStepRef = useRef(null);

  return (
    <div className={`${styles.removeApplicationFlowWrapper} ${grid.row}`}>
      <MultiStep
        navStyles={{ multiStepWrapper: styles.wrapper }}
        ref={multiStepRef}
      >
        <RemoveApplicationDetails />
        <RemoveApplicationSuccess />
      </MultiStep>
    </div>
  );
};

export default withRouter(RemoveApplicationFlow);
