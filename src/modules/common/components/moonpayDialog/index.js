import React from 'react';
import classNames from 'classnames';
import Dialog from '@theme/dialog/dialog';
import styles from './MoonpayDialog.css';

const MoonpayDialog = ({ className }) => {
  const pkKey = 'YOUR KEY';

  return (
    <Dialog className={classNames(className, styles.moonpayDialog)}>
      <div  className={classNames(styles.iframeContainer)}>
        <iframe
          id="moonpayIframe"
          src={`https://buy-sandbox.moonpay.com/?apiKey=${pkKey}&theme=dark`}
          title="MoonPay"
        />
      </div>
    </Dialog>
  );
};

export default MoonpayDialog;
