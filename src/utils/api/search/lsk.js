// eslint-disable-next-line import/prefer-default-export
export const search = data => new Promise(resolve =>
  resolve({ endpoint: 'search', token: 'LSK', data }));
