export const data = [...new Array(50)].map((_, index) => ({ id: index }));

export const mockCustomInfiniteQuery = {
  data,
  meta: {
    count: 2,
    offset: 0,
    total: data.length,
  },
};
