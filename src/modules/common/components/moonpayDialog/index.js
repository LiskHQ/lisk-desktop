import React from 'react';
import classNames from 'classnames';
import Dialog from '@theme/dialog/dialog';
import styles from './MoonpayDialog.css';

const MoonpayDialog = ({ className }) => {
  const theme = 'dark';

  return (
    <Dialog className={classNames(className, styles.moonpayDialog)}>
      <div className={classNames(styles.iframeContainer)}>
        <iframe
          id="moonpayIframe"
          src={`https://buy-sandbox.moonpay.com/?apiKey=pk_test_pb5Z9pWiJOUsIrJPkbrZOKOnKkg8UJ&theme=${theme}`}
          title="MoonPay"
        />
      </div>
    </Dialog>
  );
};

export default MoonpayDialog;
