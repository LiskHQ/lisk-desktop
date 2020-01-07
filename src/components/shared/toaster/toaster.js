import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Slide } from 'react-toastify';
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
    <ToastContainer
      position="bottom-right"
      newestOnTop
      autoClose={4000}
      hideProgressBar
      draggable={false}
      pauseOnHover
      transition={Slide}
    />
  </span>
);

export default Toaster;
