/* eslint-disable max-lines */
import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import MultiStep from 'src/modules/common/components/MultiStep';
import RemoveApplicationDetails from '../RemoveApplicationDetails';
import styles from './RemoveApplicationFlow.css';

const RemoveApplicationFlow = () => {
  const multiStepRef = useRef(null);

  return (
    <MultiStep
      navStyles={{ multiStepWrapper: styles.wrapper }}
      ref={multiStepRef}
    >
      <RemoveApplicationDetails />
    </MultiStep>
  );
};

export default withRouter(RemoveApplicationFlow);
