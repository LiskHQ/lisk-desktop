const authMiddleware = () => (next) => async (action) => {
  next(action);
};

export default authMiddleware;
