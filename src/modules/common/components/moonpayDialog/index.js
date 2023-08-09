import React from 'react';
import classNames from 'classnames';
import Dialog from '@theme/dialog/dialog';
import styles from './MoonpayDialog.css';

const MoonpayDialog = ({ className }) => {
  const pkKey = 'YOUR TEST KEY';

  return (
    <Dialog className={classNames(className, styles.moonpayDialog)}>
      <iframe
        id="moonpayIframe"
        src={`https://buy-sandbox.moonpay.com/?apiKey=${pkKey}}&theme=dark`}
        title="MoonPay"
      />
    </Dialog>
  );
};

export default MoonpayDialog;
