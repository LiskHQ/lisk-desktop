import actionTypes from 'src/modules/common/store/actionTypes';

const hwWalletMiddleware = () => (next) => (action) => {
  if (action.type === actionTypes.storeCreated) {
    // Perform hardware wallet redux middlewares here
  }

  next(action);
};

export default hwWalletMiddleware;
