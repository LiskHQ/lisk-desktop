import React from 'react';
import Toast from './toast';

const Toaster = ({ hideToast, toasts }) => (
  <span>
    {toasts.map(toast => (
      <Toast
        key={toast.index}
        toast={toast}
        timeout={4000}
        hideToast={hideToast}
      />
    ))}
  </span>
);

export default Toaster;
