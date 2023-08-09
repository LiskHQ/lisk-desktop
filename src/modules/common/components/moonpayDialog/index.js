import React from 'react';
import classNames from 'classnames';
import Dialog from '@theme/dialog/dialog';
import styles from './MoonpayDialog.css';

const MoonpayDialog = ({ className }) => {
  console.log('MoonpayDialog');

  return (
    <Dialog className={classNames(className, styles.moonpayDialog)}>
      <iframe
        id="moonpayIframe"
        src="https://buy-sandbox.moonpay.com/?apiKey=pk_test_pb5Z9pWiJOUsIrJPkbrZOKOnKkg8UJ&theme=dark"
        title="MoonPay"
      />
    </Dialog>
  );
};

export default MoonpayDialog;
