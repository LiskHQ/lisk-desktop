/* eslint-disable import/prefer-default-export */
const data = Array(30).fill(1).map((_, idx) => ({
  block: {
    timestamp: 1600000000 + idx * 267480,
  },
}));

export const mockRegistrations = {
  data,
  meta: {
    count: 30,
    offset: 0,
    total: 30,
  },
};
