import React from 'react';
import { withRouter } from 'react-router-dom';

import routes from 'src/routes/routes';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import { parseSearchParams } from 'src/utils/searchParams';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Form from '../SendForm';
import Summary from '../SendSummary';
import Status from '../SendStatus';
import styles from './send.css';

const Send = ({ history }) => {
  // istanbul ignore next
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };
  const initialValue = parseSearchParams(history.location.search);

  return (
    <Dialog hasClose>
      <MultiStep
        key="send"
        finalCallback={backToWallet}
        className={styles.wrapper}
      >
        <Form initialValue={initialValue} />
        <Summary />
        <TxSignatureCollector />

        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(Send);
