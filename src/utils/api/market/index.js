export const getPrices = data => new Promise(resolve =>
  resolve({ endpoint: 'getPrices', token: 'LSK', data }));

export const getNews = data => new Promise(resolve =>
  resolve({ endpoint: 'getNews', token: 'LSK', data }));
